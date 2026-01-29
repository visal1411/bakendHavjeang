import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('hav_jeang_auth');
      localStorage.removeItem('hav_jeang_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  register: (data) => api.post('/auth/register', data),
  checkSession: () => api.get('/auth/check-session'),
};

// Service Request API
export const serviceRequestAPI = {
  // Customer endpoints
  createRequest: (data) => api.post('/servicerequests/customer', data),
  getMyRequests: () => api.get('/servicerequests/customer/my'),
  cancelRequest: (id) => api.patch(`/servicerequests/customer/${id}/cancel`),
  getNearbyMechanics: (lat, lng) => api.get('/servicerequests/customer/nearby', { params: { lat, lng } }),
  getMechanicById: (id) => api.get(`/servicerequests/customer/${id}/info`),
  getServicesByMechanic: (mechanicId) => api.get(`/servicerequests/customer/${mechanicId}/services`),
  acceptPrice: (id) => api.patch(`/servicerequests/customer/${id}/accept-price`),
  declinePrice: (id) => api.patch(`/servicerequests/customer/${id}/decline-price`),

  // Mechanic endpoints
  getIncomingRequests: () => api.get('/servicerequests/mechanic/incoming'),
  acceptRequest: (id) => api.patch(`/servicerequests/mechanic/${id}/accept`),
  rejectRequest: (id) => api.patch(`/servicerequests/mechanic/${id}/reject`),
  completeRequest: (id) => api.patch(`/servicerequests/mechanic/${id}/complete`),
  proposePrice: (id, proposed_price) => api.patch(`/servicerequests/mechanic/${id}/propose-price`, { proposed_price }),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getByMechanic: (mechanicId) => api.get(`/services/mechanic/${mechanicId}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.patch(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Push Notification API
export const pushAPI = {
  subscribe: (subscription) => api.post('/push/subscribe', subscription),
  unsubscribe: (endpoint) => api.post('/push/unsubscribe', { endpoint }),
};

export default api;
