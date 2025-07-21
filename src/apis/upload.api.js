import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds for file upload
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Upload API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Upload Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Upload API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Upload Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Upload image
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Upload image error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi upload ảnh');
    },
  });
};

// Delete image
export const useDeleteImage = () => {
  return useMutation({
    mutationFn: async (fileName) => {
      const response = await api.delete(`/upload/image/${fileName}`);
      return response.data;
    },
    onError: (error) => {
      console.error('Delete image error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi xóa ảnh');
    },
  });
};
