import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const orderService = {
  // ================================
  // User Orders
  // ================================
  
  // Get user's own orders
  getMyOrders: async () => {
    const response = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get order by ID (with details)
  getOrderById: async (orderId: number) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Create order (checkout)
  createOrder: async (orderData: {
    cart_items: Array<{
      product_id: number;
      quantity: number;
    }>;
    payment_method?: string;
  }) => {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: number) => {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/cancel`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Download receipt/invoice
  downloadReceipt: async (orderId: number) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}/receipt`, {
      headers: getAuthHeaders(),
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },
};

export default orderService;
