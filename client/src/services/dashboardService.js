import api from './api';

export const dashboardService = {
  /**
   * Fetches admin dashboard statistics from the backend.
   */
  getDashboardStats: async () => {
    // The component's error handling will catch this
    const { data } = await api.get('/dashboard/stats');
    return data;
  },
};