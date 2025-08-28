import api from './api';

export const formService = {
  getAllSubmissions: async (filters = {}) => {
    const { data } = await api.get('/forms/submissions/all', { params: filters });
    return data;
  },

  batchDownloadSubmissions: async (submissionIds) => {
    const { data } = await api.post('/forms/submissions/batch-download', { submissionIds }, {
      responseType: 'blob', // Important for handling file downloads
    });
    return data;
  },

  getAllForms: async () => {
    const { data } = await api.get('/forms');
    return data;
  },

  getFormById: async (id) => {
    const { data } = await api.get(`/forms/${id}`);
    return data;
  },

  uploadForm: async (file) => {
    const formData = new FormData();
    formData.append('formDocx', file);
    const { data } = await api.post('/forms/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  submitFormAnswers: async (formId, answers, role, studentInfo) => {
    const { data } = await api.post(`/forms/${formId}/submit`, {
      answers,
      role,
      studentInfo,
    });
    return data;
  },

  createForm: async (formData) => {
    const { data } = await api.post('/forms/create', formData);
    return data;
  },

  deleteForm: async (id) => {
    const { data } = await api.delete(`/forms/${id}`);
    return data;
  },

  getSubmissionsForForm: async (formId) => {
    const { data } = await api.get(`/forms/${formId}/submissions`);
    return data;
  },

  getMySubmissions: async () => {
    const { data } = await api.get('/forms/my-submissions');
    return data;
  },

  getSubmissionsForCounselor: async () => {
    const { data } = await api.get('/forms/counselor-submissions');
    return data;
  },
};