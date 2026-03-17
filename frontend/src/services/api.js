import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  search: (query) => api.get('/destinations/search', { params: query }),
  create: (data) => api.post('/destinations', data),
};

export const itinerariesAPI = {
  getAll: () => api.get('/itineraries'),
  getById: (id) => api.get(`/itineraries/${id}`),
  create: (data) => api.post('/itineraries', data),
  update: (id, data) => api.put(`/itineraries/${id}`, data),
  delete: (id) => api.delete(`/itineraries/${id}`),
  getUpcoming: () => api.get('/itineraries/upcoming'),
  getCompleted: () => api.get('/itineraries/completed'),
};

export const memoriesAPI = {
  getAll: () => api.get('/memories'),
  getById: (id) => api.get(`/memories/${id}`),
  create: (data) => api.post('/memories', data),
  update: (id, data) => api.put(`/memories/${id}`, data),
  delete: (id) => api.delete(`/memories/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
