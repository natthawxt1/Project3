import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const paymentService = {
  getPaymentInfo: async (orderId: number) => {
    const response = await axios.get(`${API_URL}/payment/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ⭐ UPDATED: รับ paymentMethod เพิ่ม และส่งไปที่ backend
  confirmPayment: async (
    orderId: number,
    paymentMethod: 'promptpay' | 'wallet' | 'card'
  ) => {
    const response = await axios.post(
      `${API_URL}/payment/confirm`,
      {
        order_id: orderId,
        payment_method: paymentMethod,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};

export default paymentService;
