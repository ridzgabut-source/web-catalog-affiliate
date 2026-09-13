import { apiClient } from './apiClient.js';

export const categoryApi = {
  // Public & admin: List categories with product counts
  getCategories: (params = {}) => apiClient.getCategories(params),

  // Public: Get category by slug
  getCategoryBySlug: (slug) => apiClient.getCategoryBySlug(slug),

  // Admin: Create category
  createCategory: (categoryData) => apiClient.createCategory(categoryData),

  // Admin: Update category
  updateCategory: (id, categoryData) => apiClient.updateCategory(id, categoryData),

  // Admin: Delete category (validates dependencies and simulates 409 Conflict if in use)
  deleteCategory: (id) => apiClient.deleteCategory(id),
};
