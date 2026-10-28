import api from './api';

export const dashboardService = {
  async getSummary(params = {}) {
    try {
      const response = await api.get('/dashboard/summary', { params });
      if (response.data) return response.data;
    } catch (e) {
      console.error('Failed to load dashboard summary from live backend', e);
    }
    return {
      totalStudents: 0,
      totalInstitutions: 0,
      recordsAwaitingReview: 0,
      totalImportBatches: 0,
      openDuplicateCases: 0,
      intakeViolationsCount: 0,
      verifiedStudentsCount: 0,
      pendingReviewCount: 0,
      flaggedCount: 0,
      studentsByInstitution: {},
      studentsByAcademicYear: {},
      studentsByStatus: {},
      studentsByProgram: {},
      programIntakeOverview: [],
      recentReviewCases: [],
      recentAuditLogs: []
    };
  }
};
