import api from './api.js';

export const complianceService = {
  async getIntakeCompliance(params = {}) {
    try {
      const response = await api.get('/compliance/intake', { params });
      return response.data || [];
    } catch (e) {
      console.error('Failed to load compliance data from live backend', e);
      return [];
    }
  }
};
