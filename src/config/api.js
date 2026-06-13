// Centralized API Configuration for Next.js
import { rateLimitedRequest } from '../utils/rateLimiter';

// NEXT_PUBLIC_ prefix exposes this variable to the browser
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://4w26504b-5000.inc1.devtunnels.ms';

const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER_BUYER: `${API_BASE_URL}/api/auth/buyer/register`,
  },

  // Shopping
  SHOPPING: {
    PRODUCTS: `${API_BASE_URL}/api/shopping/products`,
    ORDERS: `${API_BASE_URL}/api/shopping/orders`,
    STATS: `${API_BASE_URL}/api/shopping/stats`,
    CHECKOUT: `${API_BASE_URL}/api/shopping/checkout`,
    ORDER_STATUS: (merchantRequestId) => `${API_BASE_URL}/api/shopping/orders/status/${merchantRequestId}`,
  },

  // Gaming Codes
  GAMING: {
    CODES: `${API_BASE_URL}/api/gaming-codes`,
    PURCHASE: `${API_BASE_URL}/api/gaming-codes/purchase`,
    CODE_STATUS: (merchantRequestId) => `${API_BASE_URL}/api/gaming-codes/status/${merchantRequestId}`,
    GET_CODE: (id) => `${API_BASE_URL}/api/gaming-codes/${id}`,
    UPDATE_CODE: (id) => `${API_BASE_URL}/api/gaming-codes/${id}`,
    DELETE_CODE: (id) => `${API_BASE_URL}/api/gaming-codes/${id}`,
    ADD_INVENTORY: (id) => `${API_BASE_URL}/api/gaming-codes/${id}/inventory`,
    GET_INVENTORY: (id) => `${API_BASE_URL}/api/gaming-codes/${id}/inventory`,
  },

  // File uploads
  UPLOADS: `${API_BASE_URL}/uploads`,
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placeholder.com';

  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  if (imagePath.includes('/uploads')) {
    return imagePath.replace(/^https?:\/\/[^/]+/, API_BASE_URL);
  }

  return imagePath;
};

// Axios default configuration safely wrapped for SSR/RSC
export const getAxiosConfig = () => {
  // Check if window is defined to safely access localStorage on the client side
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

// Rate-limited axios wrapper
export const apiRequest = (axiosCall) => rateLimitedRequest(axiosCall);

export { API_ENDPOINTS };
export default API_ENDPOINTS;
