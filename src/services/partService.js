import api from './api';

export const partService = {
  getAllParts: async () => {
    const response = await api.get('/parts');
    return response.data;
  },

  getPartById: async (id) => {
    const response = await api.get(`/parts/${id}`);
    return response.data;
  },

  createPart: async (partData) => {
    const response = await api.post('/parts', partData);
    return response.data;
  },

  updatePart: async (id, partData) => {
    const response = await api.put(`/parts/${id}`, partData);
    return response.data;
  },

  deletePart: async (id) => {
    const response = await api.delete(`/parts/${id}`);
    return response.data;
  },

  getPartsByType: async (typeId) => {
    const response = await api.get(`/parts/type/${typeId}`);
    return response.data;
  },

  getPartsByVehicle: async (vehicleId) => {
    const response = await api.get(`/parts/vehicle/${vehicleId}`);
    return response.data;
  },

  searchParts: async (searchParams) => {
    const response = await api.get('/parts/search', { params: searchParams });
    return response.data;
  }
};

export const partTypeService = {
  getAllPartTypes: async () => {
    const response = await api.get('/part-types');
    return response.data;
  },

  getPartTypeById: async (id) => {
    const response = await api.get(`/part-types/${id}`);
    return response.data;
  },

  createPartType: async (typeData) => {
    const response = await api.post('/part-types', typeData);
    return response.data;
  },

  updatePartType: async (id, typeData) => {
    const response = await api.put(`/part-types/${id}`, typeData);
    return response.data;
  },

  deletePartType: async (id) => {
    const response = await api.delete(`/part-types/${id}`);
    return response.data;
  }
};