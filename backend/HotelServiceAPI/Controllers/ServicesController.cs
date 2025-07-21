using Microsoft.AspNetCore.Mvc;
using HotelServiceAPI.Repositories;

namespace HotelServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceRepository _serviceRepository;

        public ServicesController(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        // GET: api/services
        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            try
            {
                var services = await _serviceRepository.GetActiveServicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/services/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(int id)
        {
            try
            {
                var service = await _serviceRepository.GetByIdAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Service không tồn tại" });
                }
                return Ok(service);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
