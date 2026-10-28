import api from './api.js';

export const institutionService = {
  async getAllInstitutions() {
    try {
      const response = await api.get('/institutions');
      return response.data;
    } catch (e) {
      console.error('Failed to load institutions from live backend', e);
      return [];
    }
  },

  async getInstitutionById(id) {
    const response = await api.get(`/institutions/${id}`);
    return response.data;
  },

  async createInstitution(data) {
    const response = await api.post('/institutions', data);
    return response.data;
  },

  async updateInstitution(id, data) {
    const response = await api.put(`/institutions/${id}`, data);
    return response.data;
  }
};
