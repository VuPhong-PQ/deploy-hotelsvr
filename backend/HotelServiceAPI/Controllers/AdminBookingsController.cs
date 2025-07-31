using HotelServiceAPI.Models;
using Microsoft.AspNetCore.Mvc;
using HotelServiceAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelServiceAPI.Controllers
{
    [ApiController]
    [Route("api/admin/bookings")]
    public class AdminBookingsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        public AdminBookingsController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/bookings?search=...&page=1&pageSize=10
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Service)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    (b.User != null && (b.User.FullName.Contains(search) || b.User.FirstName.Contains(search) || b.User.Email.Contains(search))) ||
                    (b.Service != null && b.Service.Name.Contains(search)) ||
                    b.Status.Contains(search) ||
                    b.PaymentMethod.Contains(search) ||
                    b.PaymentStatus.Contains(search)
                );
            }
            var total = await query.CountAsync();
            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return Ok(new { total, bookings });
        }

        // DELETE: api/admin/bookings/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }
}
