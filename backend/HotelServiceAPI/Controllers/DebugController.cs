using Microsoft.AspNetCore.Mvc;
using HotelServiceAPI.Data;
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
                return Ok(new
                {
                    DatabaseConnected = false,
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
    }

    public class ChangePasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}