import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('edutrust_token', response.data.token);
      localStorage.setItem('edutrust_user', JSON.stringify(response.data));
      return response.data;
    }
    throw new Error('Invalid authentication response from backend server');
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('edutrust_token', response.data.token);
      localStorage.setItem('edutrust_user', JSON.stringify(response.data));
      return response.data;
    }
    return response.data;
  },

  async getRegistrationInstitutions() {
    try {
      const response = await api.get('/institutions');
      return response.data;
    } catch (e) {
      return [];
    }
  },

  logout() {
    localStorage.removeItem('edutrust_token');
    localStorage.removeItem('edutrust_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('edutrust_user');
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('edutrust_token') && !!localStorage.getItem('edutrust_user');
  }
};
