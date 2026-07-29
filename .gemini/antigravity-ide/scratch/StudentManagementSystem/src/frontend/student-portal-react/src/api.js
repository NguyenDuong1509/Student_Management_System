import axios from 'axios';

// API Gateway base URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor tự động gắn Bearer Token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth & Users API (AuthService via Gateway)
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Students API (StudentService via Gateway)
export const studentApi = {
  getAll: (search = '', department = '') =>
    api.get('/students', { params: { search, department } }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Courses API (CourseService via Gateway)
export const courseApi = {
  getAll: (search = '', department = '') =>
    api.get('/courses', { params: { search, department } }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Enrollments API (EnrollmentService via Gateway)
export const enrollmentApi = {
  getAll: (studentId = '', courseId = '', semester = '') =>
    api.get('/enrollments', { params: { studentId, courseId, semester } }),
  getById: (id) => api.get(`/enrollments/${id}`),
  create: (data) => api.post('/enrollments', data),
  updateGrades: (id, data) => api.put(`/enrollments/${id}/grades`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
};
