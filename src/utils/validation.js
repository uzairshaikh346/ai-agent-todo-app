// frontend/src/utils/validation.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 6 characters
  return password.length >= 6;
};

export const validateTask = (task) => {
  // Task must have a title
  return task.title && task.title.trim().length > 0;
};

export const validateForm = (formData, formType) => {
  const errors = {};

  switch (formType) {
    case 'signup':
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      break;

    case 'login':
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      }
      break;

    case 'task':
      if (!formData.title) {
        errors.title = 'Title is required';
      } else if (formData.title.trim().length === 0) {
        errors.title = 'Title cannot be empty';
      }
      break;

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};