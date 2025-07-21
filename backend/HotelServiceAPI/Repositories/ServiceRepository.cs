using HotelServiceAPI.Data;
using HotelServiceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelServiceAPI.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .Include(s => s.CreatedByUser)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> GetActiveServicesAsync()
        {
            return await _context.Services
                .Include(s => s.CreatedByUser)
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> GetServicesByCategoryAsync(string category)
        {
            return await _context.Services
                .Include(s => s.CreatedByUser)
                .Where(s => s.IsActive && s.Category == category)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services
                .Include(s => s.CreatedByUser)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Service> CreateAsync(Service service)
        {
            service.CreatedAt = DateTime.UtcNow;
            service.UpdatedAt = DateTime.UtcNow;
            
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            
            // Return the service with related data
            return await GetByIdAsync(service.Id) ?? service;
        }

        public async Task<Service> UpdateAsync(Service service)
        {
            service.UpdatedAt = DateTime.UtcNow;
            
            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            
            return await GetByIdAsync(service.Id) ?? service;
        }

        public async Task DeleteAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service != null)
            {
                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _context.Services
                .Where(s => s.IsActive && !string.IsNullOrEmpty(s.Category))
                .Select(s => s.Category!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }
    }
}