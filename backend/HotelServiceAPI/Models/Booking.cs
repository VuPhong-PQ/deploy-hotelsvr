
using System.ComponentModel.DataAnnotations;

namespace HotelServiceAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int ServiceId { get; set; }
        
        [Required]
        public DateTime BookingDate { get; set; }
        
        [Required]
        public DateTime ServiceDate { get; set; }
        
        public int NumberOfPeople { get; set; }
        
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Pending";
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
        public Service Service { get; set; } = null!;
    }
}
