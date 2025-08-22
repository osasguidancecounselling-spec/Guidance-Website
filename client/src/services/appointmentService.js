import api from './api';

export const appointmentService = {
  requestAppointment: async (appointmentData) => {
    const { data } = await api.post('/appointments', appointmentData);
    return data;
  },
  getMyAppointments: async () => {
    const { data } = await api.get('/appointments/my');
    return data;
  },
  getAllAppointments: async () => {
    const { data } = await api.get('/appointments');
    return data;
  },
  updateAppointment: async (id, updateData) => {
    const { data } = await api.put(`/appointments/${id}`, updateData);
    return data;
  },
};
