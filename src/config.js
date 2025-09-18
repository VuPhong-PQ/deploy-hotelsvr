export const BASE_URL = 'http://36.50.55.215:5000/api';

export const USE_MOCK_API = false;

export const API_ENDPOINTS = {
  users: {
    getAll: `${BASE_URL}/users`,
    getById: (id) => `${BASE_URL}/users/${id}`,
    create: `${BASE_URL}/users`,
    update: (id) => `${BASE_URL}/users/${id}`,
    delete: (id) => `${BASE_URL}/users/${id}`,
    register: `${BASE_URL}/users/register`,
    login: `${BASE_URL}/users/login`,
  },
  services: {
    getAll: `${BASE_URL}/services`,
    getById: (id) => `${BASE_URL}/services/${id}`,
    create: `${BASE_URL}/services`,
    update: (id) => `${BASE_URL}/services/${id}`,
    delete: (id) => `${BASE_URL}/services/${id}`,
  },
  bookings: {
    getAll: `${BASE_URL}/bookings`,
    getById: (id) => `${BASE_URL}/bookings/${id}`,
    create: `${BASE_URL}/bookings`,
    update: (id) => `${BASE_URL}/bookings/${id}`,
    delete: (id) => `${BASE_URL}/bookings/${id}`,
  },
};