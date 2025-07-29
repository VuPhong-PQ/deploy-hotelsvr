
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Mock data store (tạm thời sử dụng khi backend chưa hoạt động)
let mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@hotel.com',
    password: '123456',
    phone: '0123456789',
    role: 'Admin'
  }
];

let nextId = 2;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Luôn sử dụng API thật
const USE_MOCK_API = false;

console.log(USE_MOCK_API ? '🔧 Using Mock API for user operations' : '🌐 Using Real API for user operations');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 User API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ User Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ User API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ User Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Mock API functions
const mockRegister = async (userData) => {
  await delay(1000);
  
  // Check if email exists
  const existingUser = mockUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }
  
  const newUser = {
    id: nextId++,
    ...userData
  };
  
  mockUsers.push(newUser);
  
  return {
    message: 'Đăng ký thành công',
    user: { ...newUser, password: undefined }
  };
};

const mockLogin = async (credentials) => {
  await delay(1000);
  
  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }
  
  return {
    message: 'Đăng nhập thành công',
    user: { ...user, password: undefined }
  };
};

// Register user
export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      if (USE_MOCK_API) {
        return await mockRegister(userData);
      } else {
        const response = await api.post('/users/register', {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || ''
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra');
    },
  });
};

// Login user
export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      if (USE_MOCK_API) {
        return await mockLogin(credentials);
      } else {
        const response = await api.post('/users/login', {
          email: credentials.email,
          password: credentials.password
        });
        return response.data;
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra');
    },
  });
};

// Get all users
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (USE_MOCK_API) {
        await delay(500);
        return mockUsers.map(user => ({ ...user, password: undefined }));
      } else {
        const response = await api.get('/users');
        return response.data;
      }
    },
  });
};

// Get user by ID
export const useGetUserById = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (USE_MOCK_API) {
        await delay(500);
        const user = mockUsers.find(u => u.id === parseInt(id));
        if (!user) {
          throw new Error('User not found');
        }
        return { ...user, password: undefined };
      } else {
        const response = await api.get(`/users/${id}`);
        return response.data;
      }
    },
    enabled: !!id,
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userData }) => {
      if (USE_MOCK_API) {
        await delay(1000);
        const index = mockUsers.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
          throw new Error('User not found');
        }
        
        mockUsers[index] = { ...mockUsers[index], ...userData };
        return { ...mockUsers[index], password: undefined };
      } else {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      if (USE_MOCK_API) {
        await delay(500);
        const index = mockUsers.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
          throw new Error('User not found');
        }
        
        mockUsers.splice(index, 1);
        return { message: 'User deleted successfully' };
      } else {
        const response = await api.delete(`/users/${id}`);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
