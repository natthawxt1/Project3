import api from './api';
import { Product, ProductsResponse, CategoriesResponse } from '@/types';

export const productService = {
  // Get all products with filters
  getProducts: async (params?: {
    category?: number;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },

  // Get all categories
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get('/categories');
    return response.data;
  },
};
