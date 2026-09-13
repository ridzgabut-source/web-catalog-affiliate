import { apiClient } from './apiClient.js';

export const productApi = {
  // Public product query with filter, search, sort, and pagination
  getProducts: (params = {}) => apiClient.getProducts(params),

  // Public product detail by unique slug
  getProductBySlug: (slug) => apiClient.getProductBySlug(slug),

  // Admin: Create product
  createProduct: (productData) => apiClient.createProduct(productData),

  // Admin: Update product (and status mutation via { status })
  updateProduct: (id, productData) => apiClient.updateProduct(id, productData),

  // Admin: Delete product
  deleteProduct: (id) => apiClient.deleteProduct(id),
};
