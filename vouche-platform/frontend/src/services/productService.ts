import axios from 'axios';
import { Product, ProductsResponse, SingleProductResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

const productService = {
  // Get all products
  async getProducts(): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  // Get product by ID - คืน Product ตรงๆ
  async getProductById(id: number): Promise<Product> {
    const response = await axios.get<SingleProductResponse>(`${API_BASE_URL}/products/${id}`);
    return response.data.product; // คืน .product ตรงๆ
  },

  // Get products by category
  async getProductsByCategory(categoryId: number): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/products?category_id=${categoryId}`);
    return response.data;
  },

  // Search products
  async searchProducts(query: string): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/products?search=${query}`);
    return response.data;
  },
};

export default productService;
