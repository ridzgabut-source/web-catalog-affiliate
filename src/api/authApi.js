import { apiClient } from './apiClient.js';

export const authApi = {
  // Admin login with email and password
  login: (credentials) => apiClient.login(credentials),

  // Admin logout
  logout: () => apiClient.logout(),

  // Check current admin session
  getMe: () => apiClient.getMe(),
};
