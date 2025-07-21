import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Import mock functions
import {
  useGetDashboard as mockUseGetDashboard,
  useGetAllServicesAdmin as mockUseGetAllServicesAdmin,
  useCreateService as mockUseCreateService,
  useUpdateService as mockUseUpdateService,
  useDeleteService as mockUseDeleteService,
  useExportServices as mockUseExportServices,
  useImportServices as mockUseImportServices,
  useDownloadTemplate as mockUseDownloadTemplate,
  useGetAllUsers as mockUseGetAllUsers,
  useUpdateUserRole as mockUseUpdateUserRole,
  useDeleteUser as mockUseDeleteUser,
  useGetSystemInfo as mockUseGetSystemInfo
} from './admin.api.mock';

// Configuration - set to true to use mock API
const USE_MOCK_ADMIN_API = false;

console.log(USE_MOCK_ADMIN_API ? '🔧 Using Mock Admin API' : '🌐 Using Real Admin API');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor để thêm JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔧 Admin API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Admin Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Admin API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Admin Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================================================
// DASHBOARD APIs
// =============================================================================

export const useGetDashboard = () => {
  const mockResult = mockUseGetDashboard();
  
  const realResult = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    },
    enabled: !USE_MOCK_ADMIN_API
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

// =============================================================================
// SERVICES ADMIN APIs
// =============================================================================

export const useGetAllServicesAdmin = () => {
  const mockResult = mockUseGetAllServicesAdmin();
  
  const realResult = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const response = await api.get('/services/admin/all');
      return response.data;
    },
    enabled: !USE_MOCK_ADMIN_API
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useCreateService = () => {
  const mockResult = mockUseCreateService();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async (serviceData) => {
      const response = await api.post('/services', serviceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Create service error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi tạo service');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useUpdateService = () => {
  const mockResult = mockUseUpdateService();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async ({ id, serviceData }) => {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Update service error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi cập nhật service');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useDeleteService = () => {
  const mockResult = mockUseDeleteService();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async (serviceId) => {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Delete service error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi xóa service');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

// =============================================================================
// EXCEL APIs
// =============================================================================

export const useExportServices = () => {
  const mockResult = mockUseExportServices();
  
  const realResult = useMutation({
    mutationFn: async () => {
      const response = await api.get('/services/export', {
        responseType: 'blob',
      });
      
      // Tạo blob URL và download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Services_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    onError: (error) => {
      console.error('Export services error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi export');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useImportServices = () => {
  const mockResult = mockUseImportServices();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/services/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Import services error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi import');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useDownloadTemplate = () => {
  const mockResult = mockUseDownloadTemplate();
  
  const realResult = useMutation({
    mutationFn: async () => {
      const response = await api.get('/template/services-import', {
        responseType: 'blob',
      });
      
      // Tạo blob URL và download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Services_Import_Template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    onError: (error) => {
      console.error('Download template error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi download template');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

// =============================================================================
// USER MANAGEMENT APIs
// =============================================================================

export const useGetAllUsers = () => {
  const mockResult = mockUseGetAllUsers();
  
  const realResult = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data;
    },
    enabled: !USE_MOCK_ADMIN_API
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useUpdateUserRole = () => {
  const mockResult = mockUseUpdateUserRole();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      console.error('Update user role error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi cập nhật role');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

export const useDeleteUser = () => {
  const mockResult = mockUseDeleteUser();
  const queryClient = useQueryClient();
  
  const realResult = useMutation({
    mutationFn: async (userId) => {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi xóa user');
    },
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};

// =============================================================================
// SYSTEM INFO API
// =============================================================================

export const useGetSystemInfo = () => {
  const mockResult = mockUseGetSystemInfo();
  
  const realResult = useQuery({
    queryKey: ['admin', 'system-info'],
    queryFn: async () => {
      const response = await api.get('/admin/system-info');
      return response.data;
    },
    enabled: !USE_MOCK_ADMIN_API
  });

  return USE_MOCK_ADMIN_API ? mockResult : realResult;
};
