import api from './api';

export const reportService = {
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  getReportDetails: async (reportId) => {
    const response = await api.get(`/reports/${reportId}/details`);
    return response.data;
  },

  createReportDetail: async (reportId, detailData) => {
    const response = await api.post(`/reports/${reportId}/details`, detailData);
    return response.data;
  },

  updateReportDetail: async (detailId, detailData) => {
    const response = await api.put(`/reports/details/${detailId}`, detailData);
    return response.data;
  },

  deleteReportDetail: async (detailId) => {
    const response = await api.delete(`/reports/details/${detailId}`);
    return response.data;
  }
};