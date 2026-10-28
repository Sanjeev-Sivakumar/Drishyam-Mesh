import api from './api';

export const importService = {
  async downloadTemplate() {
    try {
      const response = await api.get('/imports/template', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.error('Failed to download template from backend', e);
      throw e;
    }
  },

  async uploadAndPreview(file, institutionId) {
    const formData = new FormData();
    formData.append('file', file);
    if (institutionId) {
      formData.append('institutionId', institutionId);
    }
    const response = await api.post('/imports/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getBatches(params = {}) {
    try {
      const response = await api.get('/imports', { params });
      return response.data;
    } catch (e) {
      console.error('Failed to load import batches from live backend', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 10,
        number: params.page || 0
      };
    }
  },

  async getBatchById(batchId) {
    const response = await api.get(`/imports/${batchId}`);
    return response.data;
  },

  async getBatchRows(batchId, params = {}) {
    try {
      const response = await api.get(`/imports/${batchId}/rows`, { params });
      return response.data;
    } catch (e) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 20,
        number: params.page || 0
      };
    }
  },

  async updateBatchRow(batchId, rowId, rowData) {
    const response = await api.patch(`/imports/${batchId}/rows/${rowId}`, rowData);
    return response.data;
  },

  async commitBatch(batchId) {
    const response = await api.post(`/imports/${batchId}/commit`);
    return response.data;
  },

  async cancelBatch(batchId) {
    const response = await api.post(`/imports/${batchId}/cancel`);
    return response.data;
  }
};
