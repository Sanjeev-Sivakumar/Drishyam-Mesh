import api from './api.js';

export const studentService = {
  async getStudents(params = {}) {
    try {
      const response = await api.get('/students', { params });
      return response.data;
    } catch (e) {
      console.error('Failed to fetch students from live backend', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 10,
        number: params.page || 0
      };
    }
  },

  async getStudentById(id) {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  async createStudent(studentData) {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  async updateStudent(id, studentData) {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  async getStudentHistory(id) {
    try {
      const response = await api.get(`/students/${id}/history`);
      return response.data;
    } catch (e) {
      return [];
    }
  }
};
