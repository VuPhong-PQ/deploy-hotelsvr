
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
    console.log('🚀 Blog API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Blog Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Blog API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Blog Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get all blogs
export const useGetBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get('/blogs');
      return response.data;
    },
  });
};

// Get blog by ID
export const useGetBlogById = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get blogs by author
export const useGetBlogsByAuthor = (authorId) => {
  return useQuery({
    queryKey: ['blogs', 'author', authorId],
    queryFn: async () => {
      const response = await api.get(`/blogs/author/${authorId}`);
      return response.data;
    },
    enabled: !!authorId,
  });
};

// Create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData) => {
      const response = await api.post('/blogs', blogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Create blog error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi tạo blog');
    },
  });
};

// Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, blogData }) => {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
    onError: (error) => {
      console.error('Update blog error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi cập nhật blog');
    },
  });
};

// Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/blogs/${id}`);
      return { deletedId: id, ...response.data };
    },
    onSuccess: (data) => {
      const deletedId = data.deletedId;
      
      // Update all blogs query cache
      queryClient.setQueryData(['blogs'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(blog => blog.id !== deletedId);
      });
      
      // Update blogs by author queries 
      queryClient.setQueriesData(
        { queryKey: ['blogs', 'author'] },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(blog => blog.id !== deletedId);
        }
      );
      
      // Remove the specific blog from cache
      queryClient.removeQueries({ queryKey: ['blog', deletedId] });
      
      console.log(`✅ Blog ${deletedId} đã được xóa thành công`);
    },
    onError: (error) => {
      console.error('Delete blog error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi xóa blog');
    },
  });
};
