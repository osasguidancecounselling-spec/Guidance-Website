import api from './api';

export const studentService = {
  /**
   * Get all students with pagination and filtering
   */
  getStudents: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.course) queryParams.append('course', params.course);
    if (params.year) queryParams.append('year', params.year);
    if (params.section) queryParams.append('section', params.section);

    const { data } = await api.get(`/students?${queryParams}`);
    return data;
  },

  /**
   * Get a single student by ID
   */
  getStudent: async (id) => {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  /**
   * Create a new student
   */
  createStudent: async (studentData) => {
    const { data } = await api.post('/students', studentData);
    return data;
  },

  /**
   * Update an existing student
   */
  updateStudent: async (id, studentData) => {
    const { data } = await api.put(`/students/${id}`, studentData);
    return data;
  },

  /**
   * Delete a student
   */
  deleteStudent: async (id) => {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },

  /**
   * Get student statistics
   */
  getStudentStats: async () => {
    const { data } = await api.get('/students/stats/summary');
    return data;
  },

  /**
   * Get unique values for filters
   */
  getFilterOptions: async () => {
    const { data } = await api.get('/students');
    const students = data.students || [];
    
    const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
    const years = [...new Set(students.map(s => s.year).filter(Boolean))];
    const sections = [...new Set(students.map(s => s.section).filter(Boolean))];

    return { courses, years, sections };
  }
};
