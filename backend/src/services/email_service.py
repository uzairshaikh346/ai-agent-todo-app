import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev")


class EmailService:
    @staticmethod
    def send_password_reset_email(to_email: str, reset_token: str) -> dict:
        """Send password reset email. Returns dict with success status and reset_link on failure."""
        reset_link = f"{FRONTEND_URL}/auth/reset-password?token={reset_token}"

        try:
            params = {
                "from": FROM_EMAIL,
                "to": [to_email],
                "subject": "Reset Your Password - TaskFlow",
                "html": f"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3b82f6;">Password Reset Request</h2>
                        <p>You requested to reset your password. Click the button below to set a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{reset_link}"
                               style="background-color: #3b82f6; color: white; padding: 12px 24px;
                                      text-decoration: none; border-radius: 6px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                        </p>
                        <p style="color: #666; font-size: 14px;">
                            Or copy this link: <br/>
                            <a href="{reset_link}" style="color: #3b82f6;">{reset_link}</a>
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="color: #999; font-size: 12px;">TaskFlow - Your productivity companion</p>
                    </div>
                """,
            }

            response = resend.Emails.send(params)
            print(f"Email sent successfully: {response}")
            return {"success": True, "reset_link": None}
        except Exception as e:
            print(f"Failed to send email: {e}")
            # Return reset link for development/testing when email fails
            print(f"\n{'='*50}")
            print(f"PASSWORD RESET LINK (dev mode):")
            print(f"{reset_link}")
            print(f"{'='*50}\n")
            return {"success": False, "reset_link": reset_link}
