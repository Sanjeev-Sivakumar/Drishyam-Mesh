import api from './api.js';

export const credentialService = {
  async issueCredential(data) {
    const response = await api.post('/credentials/issue', data);
    return response.data;
  },

  async verifyCredential(data) {
    const response = await api.post('/credentials/verify', data);
    return response.data;
  },

  async getCredentials(params = {}) {
    try {
      const response = await api.get('/credentials', { params });
      return response.data;
    } catch (e) {
      console.error('Failed to load credentials from live backend', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 10,
        number: params.page || 0
      };
    }
  }
};
