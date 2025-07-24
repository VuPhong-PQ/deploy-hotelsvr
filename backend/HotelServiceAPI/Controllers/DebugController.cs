using Microsoft.AspNetCore.Mvc;
using HotelServiceAPI.Data;
using HotelServiceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DebugController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("database-status")]
        public async Task<IActionResult> GetDatabaseStatus()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                var blogCount = await _context.Blogs.CountAsync();
                var serviceCount = await _context.Services.CountAsync();

                return Ok(new
                {
                    DatabaseConnected = true,
                    UserCount = userCount,
                    BlogCount = blogCount,
                    ServiceCount = serviceCount,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    DatabaseConnected = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("users-roles")]
        public async Task<IActionResult> GetUsersAndRoles()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.Email,
                        u.FirstName,
                        u.LastName,
                        u.Role,
                        u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Success = true,
                    Users = users,
                    TotalUsers = users.Count,
                    AdminUsers = users.Count(u => u.Role == "Admin"),
                    RegularUsers = users.Count(u => u.Role == "User"),
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                });
            }
        }
                
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                return Ok(users.Select(u => new 
                { 
                    u.Id, 
                    u.Email, 
                    u.FirstName, 
                    u.LastName, 
                    u.Role,
                    PasswordHash = u.Password // For debugging only
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("make-admin/{email}")]
        public async Task<IActionResult> MakeUserAdmin(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return NotFound(new { message = $"User với email {email} không tồn tại" });
                }

                user.Role = "Admin";
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = $"Đã cập nhật user {user.FirstName} {user.LastName} ({email}) thành Admin",
                    user = new { user.Id, user.Email, user.FirstName, user.LastName, user.Role }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return NotFound(new { message = $"User với email {request.Email} không tồn tại" });
                }

                // Hash password using BCrypt (same as UserRepository)
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = $"Đã cập nhật mật khẩu cho user {user.FirstName} {user.LastName} ({request.Email})",
                    user = new { user.Id, user.Email, user.FirstName, user.LastName, user.Role }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("create-sample-services")]
        public async Task<IActionResult> CreateSampleServices()
        {
            try
            {
                // Kiểm tra nếu đã có services
                var existingCount = await _context.Services.CountAsync();
                if (existingCount > 0)
                {
                    return Ok(new { message = $"Database đã có {existingCount} services" });
                }

                // Tạo sample services
                var sampleServices = new List<Service>
                {
                    new Service
                    {
                        Name = "Spa & Wellness Center",
                        Description = "Thư giãn và tái tạo năng lượng với các liệu pháp spa cao cấp",
                        ImageUrl = "/images/spa.jpg",
                        Icon = "fa-spa",
                        Price = 150.00m,
                        Category = "Spa",
                        IsActive = true,
                        CreatedBy = 1, // Admin user
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Service
                    {
                        Name = "Nhà Hàng Cao Cấp",
                        Description = "Trải nghiệm ẩm thực đẳng cấp với các món ăn từ đầu bếp chuyên nghiệp",
                        ImageUrl = "/images/restaurant.jpg",
                        Icon = "fa-utensils",
                        Price = 200.00m,
                        Category = "Ẩm thực",
                        IsActive = true,
                        CreatedBy = 1,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Service
                    {
                        Name = "Gym & Fitness",
                        Description = "Phòng gym hiện đại với đầy đủ trang thiết bị tập luyện",
                        ImageUrl = "/images/gym.jpg",
                        Icon = "fa-dumbbell",
                        Price = 80.00m,
                        Category = "Thể thao",
                        IsActive = true,
                        CreatedBy = 1,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                _context.Services.AddRange(sampleServices);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = $"Đã tạo {sampleServices.Count} sample services thành công",
                    services = sampleServices.Select(s => new { s.Id, s.Name, s.Price, s.Category }).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }

    public class ChangePasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}