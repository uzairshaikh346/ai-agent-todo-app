// frontend/src/services/auth.js
import api from './api';

export const authService = {
  async signup(email, password) {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  },

  async signin(email, password) {
    try {
      const response = await api.post('/auth/signin', {
        email,
        password,
      });
      
      // Store the token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Signin failed');
    }
  },

  async signout() {
    // Remove the token from localStorage
    localStorage.removeItem('access_token');
  },

  isAuthenticated() {
    // Check if token exists in localStorage
    return !!localStorage.getItem('access_token');
  },

  getCurrentUser() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      return null;
    }
  },

  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  },
};