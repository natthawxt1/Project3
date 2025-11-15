import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const adminService = {
  // ================================
  // Products
  // ================================
  getProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  createProduct: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: number, formData: FormData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ================================
  // Categories
  // ================================
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  createCategory: async (data: { name: string }) => {
    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  updateCategory: async (id: number, data: { name: string }) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ================================
  // Orders
  // ================================
  getOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  getOrderDetails: async (id: number) => {
    const response = await axios.get(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await axios.put(
      `${API_URL}/orders/${id}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  // ================================
  // Gift Codes
  // ================================
  getGiftCodes: async (params?: { status?: string; product_id?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.product_id) queryParams.append('product_id', params.product_id);

    const queryString = queryParams.toString();
    const url = `${API_URL}/gift-codes${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  bulkAddGiftCodes: async (data: { product_id: number; codes: string[] }) => {
    const response = await axios.post(`${API_URL}/gift-codes/bulk`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  deleteGiftCode: async (id: number) => {
    const response = await axios.delete(`${API_URL}/gift-codes/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

};



export default adminService;
