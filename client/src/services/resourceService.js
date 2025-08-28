import api from './api';

const resourceService = {
  // Get all resources
  getResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get a single resource
  getResource: async (id) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  // Create a new resource
  createResource: async (resourceData) => {
    try {
      const response = await api.post('/resources', resourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Update a resource
  updateResource: async (id, resourceData) => {
    try {
      const response = await api.put(`/resources/${id}`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Delete a resource
  deleteResource: async (id) => {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }
};

export default resourceService;
