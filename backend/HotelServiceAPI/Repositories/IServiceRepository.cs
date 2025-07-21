using HotelServiceAPI.Models;

namespace HotelServiceAPI.Repositories
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<IEnumerable<Service>> GetActiveServicesAsync();
        Task<IEnumerable<Service>> GetServicesByCategoryAsync(string category);
        Task<Service?> GetByIdAsync(int id);
        Task<Service> CreateAsync(Service service);
        Task<Service> UpdateAsync(Service service);
        Task DeleteAsync(int id);
        Task<IEnumerable<string>> GetCategoriesAsync();
    }
}
