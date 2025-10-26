import api from './api';

export const maintenancePlanService = {
  getAllMaintenancePlans: async () => {
    const response = await api.get('/maintenance-plans');
    return response.data;
  },

  getMaintenancePlanById: async (id) => {
    const response = await api.get(`/maintenance-plans/${id}`);
    return response.data;
  },

  createMaintenancePlan: async (planData) => {
    const response = await api.post('/maintenance-plans', planData);
    return response.data;
  },

  updateMaintenancePlan: async (id, planData) => {
    const response = await api.put(`/maintenance-plans/${id}`, planData);
    return response.data;
  },

  deleteMaintenancePlan: async (id) => {
    const response = await api.delete(`/maintenance-plans/${id}`);
    return response.data;
  },

  getPlanItems: async (planId) => {
    const response = await api.get(`/maintenance-plans/${planId}/items`);
    return response.data;
  },

  createPlanItem: async (planId, itemData) => {
    const response = await api.post(`/maintenance-plans/${planId}/items`, itemData);
    return response.data;
  },

  updatePlanItem: async (itemId, itemData) => {
    const response = await api.put(`/maintenance-plans/items/${itemId}`, itemData);
    return response.data;
  },

  deletePlanItem: async (itemId) => {
    const response = await api.delete(`/maintenance-plans/items/${itemId}`);
    return response.data;
  }
};

export const reminderService = {
  getAllReminders: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },

  getReminderById: async (id) => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },

  createReminder: async (reminderData) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },

  updateReminder: async (id, reminderData) => {
    const response = await api.put(`/reminders/${id}`, reminderData);
    return response.data;
  },

  deleteReminder: async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },

  getRemindersByVehicle: async (vehicleId) => {
    const response = await api.get(`/reminders/vehicle/${vehicleId}`);
    return response.data;
  },

  getRemindersByStatus: async (status) => {
    const response = await api.get(`/reminders/status/${status}`);
    return response.data;
  },

  getUpcomingReminders: async () => {
    const response = await api.get('/reminders/upcoming');
    return response.data;
  }
};