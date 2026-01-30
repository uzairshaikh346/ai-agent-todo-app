from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from pydantic import BaseModel, field_validator
from ..database import get_session
from ..models.user import User, UserCreate, UserRead
from ..models.password_reset import PasswordResetToken
from ..services.auth_service import AuthService
from ..services.email_service import EmailService
from ..utils.security import create_access_token, get_password_hash
from datetime import timedelta
import uuid

router = APIRouter()


class SignInRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password must not exceed 72 bytes')
        return v

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(user_create: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    try:
        # Create the user
        db_user = AuthService.create_user(session, user_create)
        # Convert to response model
        return UserRead(id=db_user.id, email=db_user.email, created_at=db_user.created_at)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )

@router.post("/signin")
def signin(credentials: SignInRequest, session: Session = Depends(get_session)):
    """Authenticate a user and return access token"""
    user = AuthService.authenticate_user(session, credentials.email, credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, session: Session = Depends(get_session)):
    """Request a password reset email"""
    # Find user by email
    user = session.exec(select(User).where(User.email == request.email)).first()

    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    # Invalidate any existing tokens for this user
    existing_tokens = session.exec(
        select(PasswordResetToken).where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False
        )
    ).all()
    for token in existing_tokens:
        token.used = True
        session.add(token)

    # Create new reset token
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=PasswordResetToken.generate_token(),
        expires_at=PasswordResetToken.get_expiry(hours=1)
    )
    session.add(reset_token)
    session.commit()

    # Send email (returns reset_link if email fails - useful for testing)
    email_result = EmailService.send_password_reset_email(user.email, reset_token.token)

    if email_result["success"]:
        return {"message": "Password reset link has been sent to your email."}
    else:
        # Return reset link when email fails (for development/testing)
        return {
            "message": "Email service unavailable. Use the link below to reset your password.",
            "reset_link": email_result["reset_link"]
        }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, session: Session = Depends(get_session)):
    """Reset password using token"""
    # Find the token
    token_record = session.exec(
        select(PasswordResetToken).where(PasswordResetToken.token == request.token)
    ).first()

    if not token_record or not token_record.is_valid():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Find the user
    user = session.exec(select(User).where(User.id == token_record.user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )

    # Update password
    user.password_hash = get_password_hash(request.new_password)
    session.add(user)

    # Mark token as used
    token_record.used = True
    session.add(token_record)

    session.commit()

    return {"message": "Password has been reset successfully"}