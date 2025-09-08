import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      // Try both possible token locations
      const token = authData.state?.token || authData.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - backend server may not be running');
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Products API functions
export const productsAPI = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured/list', { params: { limit } });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/meta/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/products/meta/brands');
    return response.data;
  },

  searchProducts: async (query, limit = 10) => {
    const response = await api.get('/products/search', { params: { q: query, limit } });
    return response.data;
  },

  // Admin product functions
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Orders API functions
export const ordersAPI = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};

// Admin API functions
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/admin/orders/${id}/status`, statusData);
    return response.data;
  },

  getAllProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }
};

// Test API connection
export const testAPI = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('API Test failed:', error);
    throw error;
  }
};

export default api;
