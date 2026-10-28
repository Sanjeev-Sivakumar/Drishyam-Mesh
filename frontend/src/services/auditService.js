import api from './api.js';

export const auditService = {
  async getAuditLogs(params = {}) {
    try {
      const response = await api.get('/audit/logs', { params });
      return response.data;
    } catch (e) {
      console.error('Failed to load audit logs from live backend', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 15,
        number: params.page || 0
      };
    }
  }
};
