
using HotelServiceAPI.Models;

namespace HotelServiceAPI.Repositories
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service?> GetServiceByIdAsync(int id);
        Task<Service> CreateServiceAsync(Service service);
        Task<Service> UpdateServiceAsync(Service service);
        Task<bool> DeleteServiceAsync(int id);
    }
}
