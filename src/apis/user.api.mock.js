import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Mock data store
let mockUsers = [];

let nextId = 2;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const mockAPI = {
  register: async (userData) => {
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
      user: { ...newUser, password: undefined } // Don't return password
    };
  },
  
  login: async (credentials) => {
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
  },
  
  getUsers: async () => {
    await delay(500);
    return mockUsers.map(user => ({ ...user, password: undefined }));
  },
  
  getUserById: async (id) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user, password: undefined };
  },
  
  updateUser: async ({ id, userData }) => {
    await delay(1000);
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return { ...mockUsers[index], password: undefined };
  },
  
  deleteUser: async (id) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    mockUsers.splice(index, 1);
    return { message: 'User deleted successfully' };
  }
};

// Register user
export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockAPI.register,
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
    mutationFn: mockAPI.login,
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
    queryFn: mockAPI.getUsers,
  });
};

// Get user by ID
export const useGetUserById = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => mockAPI.getUserById(id),
    enabled: !!id,
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockAPI.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
