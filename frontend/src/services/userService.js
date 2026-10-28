import api from './api.js';

export const userService = {
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (e) {
      const stored = localStorage.getItem('edutrust_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (ignored) {}
      }
      return null;
    }
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    if (response.data) {
      localStorage.setItem('edutrust_user', JSON.stringify(response.data));
    }
    return response.data;
  }
};

export default userService;
