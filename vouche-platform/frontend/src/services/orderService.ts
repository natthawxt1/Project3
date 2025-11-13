import api from './api';
import { Order, OrdersResponse, OrderDetailsResponse } from '@/types';

export const orderService = {
  // Create new order
  createOrder: async (orderData: { items: any[]; payment_method: string }): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data.order;
  },

  // Get all orders (Admin)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<OrdersResponse>('/orders');
    return response.data.orders;
  },

  // Get user's orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get<OrdersResponse>('/orders/user');
    return response.data.orders;
  },

  // Get order details
  getOrderDetails: async (id: number): Promise<Order> => {
    const response = await api.get<OrderDetailsResponse>(`/orders/${id}`);
    return response.data.order;
  },

  // Update order status (Admin)
  updateOrderStatus: async (id: number, status: string): Promise<any> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};