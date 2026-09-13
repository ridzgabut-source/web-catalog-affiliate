import { mockStorage } from './mockStorage.js';

// Configuration: Switch between 'MOCK' and 'REST'
const API_MODE = import.meta.env.VITE_API_MODE || 'MOCK';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.mode = API_MODE;
    this.baseUrl = API_BASE_URL;
  }

  // --- Generic Router ---
  async request(endpoint, options = {}) {
    if (this.mode === 'REST') {
      return this.realFetch(endpoint, options);
    }
    // In MOCK mode, mockStorage handles persistence and latency
    throw new Error(`Direct request '${endpoint}' not implemented in mock adapter. Use domain methods.`);
  }

  // Helper for real REST API when backend is plugged in
  async realFetch(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
    const token = localStorage.getItem('kk_auth_token_v1');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : null,
      });

      const json = await response.json();
      return json;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Koneksi ke server gagal. Silakan periksa jaringan Anda.',
        errors: { network: [error.message] },
      };
    }
  }

  // --- Category Handlers ---
  async getCategories(params) {
    if (this.mode === 'REST') {
      const query = new URLSearchParams(params).toString();
      return this.realFetch(`/categories?${query}`);
    }
    return mockStorage.getCategories(params);
  }

  async getCategoryBySlug(slug) {
    if (this.mode === 'REST') {
      return this.realFetch(`/categories/${slug}`);
    }
    return mockStorage.getCategoryBySlug(slug);
  }

  async createCategory(data) {
    if (this.mode === 'REST') {
      return this.realFetch('/admin/categories', { method: 'POST', body: data });
    }
    return mockStorage.createCategory(data);
  }

  async updateCategory(id, data) {
    if (this.mode === 'REST') {
      return this.realFetch(`/admin/categories/${id}`, { method: 'PUT', body: data });
    }
    return mockStorage.updateCategory(id, data);
  }

  async deleteCategory(id) {
    if (this.mode === 'REST') {
      return this.realFetch(`/admin/categories/${id}`, { method: 'DELETE' });
    }
    return mockStorage.deleteCategory(id);
  }

  // --- Product Handlers ---
  async getProducts(params) {
    if (this.mode === 'REST') {
      const query = new URLSearchParams(params).toString();
      return this.realFetch(`/products?${query}`);
    }
    return mockStorage.getProducts(params);
  }

  async getProductBySlug(slug) {
    if (this.mode === 'REST') {
      return this.realFetch(`/products/${slug}`);
    }
    return mockStorage.getProductBySlug(slug);
  }

  async createProduct(data) {
    if (this.mode === 'REST') {
      return this.realFetch('/admin/products', { method: 'POST', body: data });
    }
    return mockStorage.createProduct(data);
  }

  async updateProduct(id, data) {
    if (this.mode === 'REST') {
      return this.realFetch(`/admin/products/${id}`, { method: 'PUT', body: data });
    }
    return mockStorage.updateProduct(id, data);
  }

  async deleteProduct(id) {
    if (this.mode === 'REST') {
      return this.realFetch(`/admin/products/${id}`, { method: 'DELETE' });
    }
    return mockStorage.deleteProduct(id);
  }

  // --- Auth Handlers ---
  async login(credentials) {
    if (this.mode === 'REST') {
      return this.realFetch('/auth/login', { method: 'POST', body: credentials });
    }
    return mockStorage.login(credentials);
  }

  async logout() {
    if (this.mode === 'REST') {
      return this.realFetch('/auth/logout', { method: 'POST' });
    }
    return mockStorage.logout();
  }

  async getMe() {
    if (this.mode === 'REST') {
      return this.realFetch('/auth/me');
    }
    return mockStorage.getMe();
  }

  // --- Dev Tools ---
  resetMockData() {
    return mockStorage.resetToDefault();
  }
}

export const apiClient = new ApiClient();
