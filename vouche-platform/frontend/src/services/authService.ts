import api from './api';

// src/services/authService.ts
export const authService = {
  async getProfile() {
    try {
      const response = await api.get('/users/profile'); // หรือ /auth/profile
      console.log('🔍 Profile Response:', response.data); // ⭐ เพิ่มตรงนี้
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('🔍 Login Response:', response.data); // ⭐ เพิ่มตรงนี้
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      console.log('🔍 Register Response:', response.data); // ⭐ เพิ่มตรงนี้
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
