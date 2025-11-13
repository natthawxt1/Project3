import api from './api';
import { Category, CategoriesResponse } from '@/types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data.categories;
  },

  // Get single category
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },

  // Create category (Admin)
  createCategory: async (name: string): Promise<any> => {
    const response = await api.post('/categories', { name });
    return response.data;
  },

  // Update category (Admin)
  updateCategory: async (id: number, name: string): Promise<any> => {
    const response = await api.put(`/categories/${id}`, { name });
    return response.data;
  },

  // Delete category (Admin)
  deleteCategory: async (id: number): Promise<any> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};