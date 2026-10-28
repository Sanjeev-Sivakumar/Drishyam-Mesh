import api from './api.js';

export const reviewService = {
  async getCases(params = {}) {
    try {
      const response = await api.get('/reviews', { params });
      return response.data;
    } catch (e) {
      console.error('Failed to load review cases from live backend', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 10,
        number: params.page || 0
      };
    }
  },

  async getCaseById(id) {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  async resolveCase(id, resolutionData) {
    const response = await api.post(`/reviews/${id}/resolve`, resolutionData);
    return response.data;
  },

  async dismissCase(id, dismissalData) {
    const response = await api.post(`/reviews/${id}/dismiss`, dismissalData);
    return response.data;
  }
};
