import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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
    console.log('🚀 Comment API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Comment Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Comment API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Comment Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get comments by blog ID
export const useGetCommentsByBlogId = (blogId) => {
  return useQuery({
    queryKey: ['comments', blogId],
    queryFn: async () => {
      const response = await api.get(`/comments/blog/${blogId}`);
      return response.data;
    },
    enabled: !!blogId,
  });
};

// Create comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentData) => {
      const response = await api.post('/comments', commentData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments for the specific blog
      queryClient.invalidateQueries({ queryKey: ['comments', variables.blogId] });
      // Also invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Create comment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi tạo comment');
    },
  });
};

// Update comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, commentData }) => {
      const response = await api.put(`/comments/${id}`, commentData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate comments for the specific blog
      queryClient.invalidateQueries({ queryKey: ['comments', data.blogId] });
      // Also invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Update comment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi cập nhật comment');
    },
  });
};

// Delete comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, userId }) => {
      console.log('🚀 Deleting comment:', { commentId, userId });
      
      // Đảm bảo gửi đúng format parameters
      const response = await api.delete(`/comments/${commentId}?userId=${userId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments query
      queryClient.invalidateQueries({ 
        queryKey: ['comments'] 
      });
      
      console.log('✅ Comment deleted successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Delete comment error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi xóa comment';
      throw new Error(errorMessage);
    },
  });
};
