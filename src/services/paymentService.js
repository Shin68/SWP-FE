import api from './api';

export const paymentService = {
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePayment: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByStatus: async (status) => {
    const response = await api.get(`/payments/status/${status}`);
    return response.data;
  },

  getPaymentsByMethod: async (method) => {
    const response = await api.get(`/payments/method/${method}`);
    return response.data;
  }
};