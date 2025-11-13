import api from './api';

const adminService = {
  // Products
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (name: string) => {
    const response = await api.post('/categories', { name });
    return response.data;
  },

  updateCategory: async (id: number, name: string) => {
    const response = await api.put(`/categories/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default adminService;