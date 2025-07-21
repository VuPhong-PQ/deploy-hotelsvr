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
                    u.Role 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}