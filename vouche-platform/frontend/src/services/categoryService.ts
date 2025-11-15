import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number) => {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  },

  // Create category (Admin)
  createCategory: async (data: { name: string; description?: string }) => {
    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Update category (Admin)
  updateCategory: async (id: number, data: { name: string; description?: string }) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Delete category (Admin)
  deleteCategory: async (id: number) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default categoryService;
