using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HotelServiceAPI.Repositories;
using HotelServiceAPI.Models;
using HotelServiceAPI.Models.DTOs;
using HotelServiceAPI.Services;
using System.Security.Claims;

namespace HotelServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IExcelService _excelService;

        public ServicesController(IServiceRepository serviceRepository, IExcelService excelService)
        {
            _serviceRepository = serviceRepository;
            _excelService = excelService;
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

        // ============= ADMIN ENDPOINTS =============

        // GET: api/services/admin/all - Chỉ admin xem được tất cả services (kể cả inactive)
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllServicesForAdmin()
        {
            try
            {
                var services = await _serviceRepository.GetAllServicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/services - Tạo service mới (chỉ admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateService([FromBody] ServiceCreateDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var service = new Service
                {
                    Name = request.Name,
                    Description = request.Description,
                    ImageUrl = request.ImageUrl,
                    Icon = request.Icon,
                    Price = request.Price,
                    Category = request.Category,
                    IsActive = request.IsActive,
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdService = await _serviceRepository.CreateAsync(service);
                return CreatedAtAction(nameof(GetService), new { id = createdService.Id }, createdService);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // PUT: api/services/{id} - Cập nhật service (chỉ admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceUpdateDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingService = await _serviceRepository.GetByIdAsync(id);
                if (existingService == null)
                {
                    return NotFound(new { message = "Service không tồn tại" });
                }

                existingService.Name = request.Name;
                existingService.Description = request.Description;
                existingService.ImageUrl = request.ImageUrl;
                existingService.Icon = request.Icon;
                existingService.Price = request.Price;
                existingService.Category = request.Category;
                existingService.IsActive = request.IsActive;
                existingService.UpdatedAt = DateTime.UtcNow;

                var updatedService = await _serviceRepository.UpdateAsync(existingService);
                return Ok(updatedService);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // DELETE: api/services/{id} - Xóa service (chỉ admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            try
            {
                var existingService = await _serviceRepository.GetByIdAsync(id);
                if (existingService == null)
                {
                    return NotFound(new { message = "Service không tồn tại" });
                }

                await _serviceRepository.DeleteAsync(id);
                return Ok(new { message = "Xóa service thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/services/export - Export services to Excel (chỉ admin)
        [HttpGet("export")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExportServicesToExcel()
        {
            try
            {
                var services = await _serviceRepository.GetAllServicesForExportAsync();
                var excelData = await _excelService.ExportServicesToExcelAsync(services);

                var fileName = $"Services_Export_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/services/import - Import services from Excel (chỉ admin)
        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportServicesFromExcel(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "Vui lòng chọn file Excel" });
                }

                if (!file.FileName.EndsWith(".xlsx") && !file.FileName.EndsWith(".xls"))
                {
                    return BadRequest(new { message = "File phải có định dạng Excel (.xlsx hoặc .xls)" });
                }

                // Get current user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized(new { message = "Không thể xác định người dùng" });
                }

                using var stream = file.OpenReadStream();
                var importedServices = await _excelService.ImportServicesFromExcelAsync(stream);

                var successCount = 0;
                var errors = new List<string>();

                foreach (var serviceDto in importedServices)
                {
                    try
                    {
                        var service = new Service
                        {
                            Name = serviceDto.Name,
                            Description = serviceDto.Description,
                            ImageUrl = serviceDto.ImageUrl,
                            Icon = serviceDto.Icon,
                            Price = serviceDto.Price,
                            Category = serviceDto.Category,
                            IsActive = serviceDto.IsActive,
                            CreatedBy = userId,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await _serviceRepository.CreateAsync(service);
                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Lỗi khi import service '{serviceDto.Name}': {ex.Message}");
                    }
                }

                return Ok(new 
                { 
                    message = $"Import thành công {successCount} services",
                    successCount,
                    errorCount = errors.Count,
                    errors
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
