import api from './api';

export const vehicleService = {
  getAllVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  getVehiclesByCustomer: async (customerId) => {
    const response = await api.get(`/vehicles/customer/${customerId}`);
    return response.data;
  },

  searchVehicles: async (searchParams) => {
    const response = await api.get('/vehicles/search', { params: searchParams });
    return response.data;
  }
};