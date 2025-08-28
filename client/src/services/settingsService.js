import api from './api';

export const settingsService = {
  /**
   * Fetches the counselor's availability settings from the backend.
   * Assumes a GET /api/settings/availability endpoint.
   */
  getAvailability: async () => {
    const { data } = await api.get('/settings/availability');
    return data;
  },

  /**
   * Updates the counselor's availability settings.
   * Assumes a PUT /api/settings/availability endpoint.
   * @param {Array} availabilityData - An array of availability objects.
   */
  updateAvailability: async (availabilityData) => {
    const { data } = await api.put('/settings/availability', { availability: availabilityData });
    return data;
  },
};