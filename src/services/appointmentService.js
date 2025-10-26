import api from './api';

export const appointmentService = {
  getAllAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  getAppointmentsByVehicle: async (vehicleId) => {
    const response = await api.get(`/appointments/vehicle/${vehicleId}`);
    return response.data;
  },

  getAppointmentsByServiceCenter: async (centerId) => {
    const response = await api.get(`/appointments/service-center/${centerId}`);
    return response.data;
  },

  getAppointmentsByDate: async (date) => {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  }
};