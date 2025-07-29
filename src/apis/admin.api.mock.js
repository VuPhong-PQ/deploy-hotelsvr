import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Mock data for testing admin functionality
let mockServices = [];

let mockUsers = [];

let mockDashboard = {
  totalServices: 3,
  totalUsers: 3,
  totalBlogs: 5,
  totalBookings: 12
};

let nextServiceId = 4;
let nextUserId = 4;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration - set to true to use mock API for admin
const USE_MOCK_ADMIN_API = false;

console.log(USE_MOCK_ADMIN_API ? '🔧 Using Mock Admin API' : '🌐 Using Real Admin API');

// =============================================================================
// DASHBOARD APIs
// =============================================================================

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(500);
        return mockDashboard;
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
  });
};

// =============================================================================
// SERVICES ADMIN APIs
// =============================================================================

export const useGetAllServicesAdmin = () => {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(800);
        return mockServices;
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceData) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(1000);
        const newService = {
          id: nextServiceId++,
          ...serviceData,
          createdAt: new Date().toISOString()
        };
        mockServices.push(newService);
        mockDashboard.totalServices++;
        return newService;
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      console.error('Create service error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi tạo service');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, serviceData }) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(1000);
        const index = mockServices.findIndex(s => s.id === id);
        if (index === -1) {
          throw new Error('Không tìm thấy service');
        }
        mockServices[index] = { ...mockServices[index], ...serviceData };
        return mockServices[index];
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
    onError: (error) => {
      console.error('Update service error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi cập nhật service');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceId) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(800);
        const index = mockServices.findIndex(s => s.id === serviceId);
        if (index === -1) {
          throw new Error('Không tìm thấy service');
        }
        mockServices.splice(index, 1);
        mockDashboard.totalServices--;
        return { success: true };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      console.error('Delete service error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi xóa service');
    },
  });
};

// =============================================================================
// EXCEL APIs
// =============================================================================

export const useExportServices = () => {
  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(1500);
        
        // Create CSV content (simulating Excel export)
        const csvContent = [
          'ID,Title,Description,Price,Featured',
          ...mockServices.map(s => 
            `${s.id},"${s.title}","${s.description}",${s.price},${s.featured}`
          )
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Services_Export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Export thành công!' };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onError: (error) => {
      console.error('Export services error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi export');
    },
  });
};

export const useImportServices = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(2000);
        
        // Simulate importing 2-3 new services
        const importedServices = [
          {
            id: nextServiceId++,
            title: 'Pool & Beach Access',
            description: 'Truy cập hồ bơi vô cực và bãi biển riêng',
            price: 120,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            featured: false
          },
          {
            id: nextServiceId++,
            title: 'Conference Room',
            description: 'Phòng hội nghị hiện đại cho doanh nghiệp',
            price: 200,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
            featured: false
          }
        ];
        
        mockServices.push(...importedServices);
        mockDashboard.totalServices += importedServices.length;
        
        return { 
          success: true, 
          importedCount: importedServices.length,
          message: `Import thành công ${importedServices.length} dịch vụ!`
        };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      console.error('Import services error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi import');
    },
  });
};

export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(800);
        
        // Create template CSV
        const templateContent = [
          'ID,Title,Description,Price,Featured',
          '1,"Sample Service","Sample description",100,true',
          '2,"Another Service","Another description",150,false'
        ].join('\n');
        
        const blob = new Blob([templateContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Services_Import_Template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onError: (error) => {
      console.error('Download template error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi download template');
    },
  });
};

// =============================================================================
// USER MANAGEMENT APIs
// =============================================================================

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(600);
        return mockUsers;
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(1000);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
          throw new Error('Không tìm thấy user');
        }
        user.role = role;
        return user;
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      console.error('Update user role error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi cập nhật role');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId) => {
      if (USE_MOCK_ADMIN_API) {
        await delay(800);
        const index = mockUsers.findIndex(u => u.id === userId);
        if (index === -1) {
          throw new Error('Không tìm thấy user');
        }
        mockUsers.splice(index, 1);
        mockDashboard.totalUsers--;
        return { success: true };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      console.error('Delete user error:', error);
      throw new Error(error.message || 'Đã có lỗi xảy ra khi xóa user');
    },
  });
};

// =============================================================================
// SYSTEM INFO API
// =============================================================================

export const useGetSystemInfo = () => {
  return useQuery({
    queryKey: ['admin', 'system-info'],
    queryFn: async () => {
      if (USE_MOCK_ADMIN_API) {
        await delay(700);
        return {
          version: 'ASP.NET Core 8.0',
          uptime: 7200, // 2 hours
          environment: 'Development',
          serverName: 'localhost',
          port: '5000',
          databaseType: 'SQL Server',
          databaseServer: 'localhost',
          databaseName: 'HotelServiceDB',
          tableCount: 6,
          databaseSize: 15728640, // 15 MB
          memoryUsed: 134217728, // 128 MB
          totalMemory: 1073741824 // 1 GB
        };
      }
      // Real API call would go here
      throw new Error('Real API not implemented yet');
    },
  });
};
