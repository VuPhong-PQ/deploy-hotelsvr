using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HotelServiceAPI.Repositories;
using HotelServiceAPI.Models;
using HotelServiceAPI.Models.DTOs;
using HotelServiceAPI.Services;
using Microsoft.EntityFrameworkCore;
using HotelServiceAPI.Data;

namespace HotelServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IServiceRepository _serviceRepository;
        private readonly IUserRepository _userRepository;
        private readonly IBlogRepository _blogRepository;
        private readonly IExcelService _excelService;

        public AdminController(
            ApplicationDbContext context,
            IServiceRepository serviceRepository,
            IUserRepository userRepository,
            IBlogRepository blogRepository,
            IExcelService excelService)
        {
            _context = context;
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _blogRepository = blogRepository;
            _excelService = excelService;
        }

        // GET: api/admin/dashboard - Thống kê tổng quan
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var totalServices = await _context.Services.CountAsync();
                var activeServices = await _context.Services.CountAsync(s => s.IsActive);
                var totalBlogs = await _context.Blogs.CountAsync();
                // var totalComments = await _context.Comments.CountAsync(); // TEMPORARILY DISABLED
                var totalComments = 0;

                var recentUsers = await _context.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(5)
                    .Select(u => new { u.Id, u.FullName, u.Email, u.CreatedAt, u.Role })
                    .ToListAsync();

                var recentServices = await _context.Services
                    // .Include(s => s.CreatedByUser) // Tạm thời comment để tránh lỗi FK
                    .OrderByDescending(s => s.CreatedAt)
                    .Take(5)
                    .Select(s => new { s.Id, s.Name, s.Price, s.Category, s.IsActive, s.CreatedAt, CreatedBy = "Admin" }) // s.CreatedByUser.FullName })
                    .ToListAsync();

                return Ok(new
                {
                    stats = new
                    {
                        totalUsers,
                        totalServices,
                        activeServices,
                        inactiveServices = totalServices - activeServices,
                        totalBlogs,
                        totalComments
                    },
                    recentUsers,
                    recentServices
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/admin/users - Quản lý users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        FullName = u.FullName,
                        u.Email,
                        u.Phone,
                        u.Role,
                        u.CreatedAt,
                        BlogsCount = u.Blogs.Count(),
                        CommentsCount = u.Comments.Count(),
                        ServicesCount = 0 // Tạm thời set 0 vì đã comment CreatedServices
                    })
                    .OrderByDescending(u => u.CreatedAt)
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // PUT: api/admin/users/{id}/role - Thay đổi role của user
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User không tồn tại" });
                }

                user.Role = request.Role;
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Đã cập nhật role của user {user.FullName} thành {request.Role}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // DELETE: api/admin/users/{id} - Xóa user
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User không tồn tại" });
                }

                // Không cho phép xóa admin cuối cùng
                var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
                if (user.Role == "Admin" && adminCount <= 1)
                {
                    return BadRequest(new { message = "Không thể xóa admin cuối cùng trong hệ thống" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Đã xóa user {user.FullName}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/admin/system-info - Thông tin hệ thống
        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            try
            {
                var dbConnection = _context.Database.GetConnectionString();
                var serverVersion = await _context.Database.ExecuteSqlRawAsync("SELECT @@VERSION");
                
                return Ok(new
                {
                    serverTime = DateTime.UtcNow,
                    localTime = DateTime.Now,
                    database = new
                    {
                        connectionString = dbConnection?.Split(';').FirstOrDefault(),
                        tablesCount = await GetTablesCountAsync()
                    },
                    application = new
                    {
                        version = "1.0.0",
                        environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private async Task<int> GetTablesCountAsync()
        {
            try
            {
                var tableCount = await _context.Database.SqlQueryRaw<int>(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
                    .FirstOrDefaultAsync();
                return tableCount;
            }
            catch
            {
                return 0;
            }
        }
    }

    // DTO for updating user role
    public class UpdateUserRoleDto
    {
        public string Role { get; set; } = "User";
    }
}
