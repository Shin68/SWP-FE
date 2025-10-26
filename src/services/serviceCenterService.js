import api from './api';

export const serviceCenterService = {
  getAllServiceCenters: async () => {
    const response = await api.get('/service-centers');
    return response.data;
  },

  getServiceCenterById: async (id) => {
    const response = await api.get(`/service-centers/${id}`);
    return response.data;
  },

  createServiceCenter: async (centerData) => {
    const response = await api.post('/service-centers', centerData);
    return response.data;
  },

  updateServiceCenter: async (id, centerData) => {
    const response = await api.put(`/service-centers/${id}`, centerData);
    return response.data;
  },

  deleteServiceCenter: async (id) => {
    const response = await api.delete(`/service-centers/${id}`);
    return response.data;
  }
};