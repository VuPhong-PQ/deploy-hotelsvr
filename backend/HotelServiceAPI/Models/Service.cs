
using System.ComponentModel.DataAnnotations;

namespace HotelServiceAPI.Models
{
    public class Service
    {
        public int Id { get; set; }
        
        [Required]
        public string ServiceName { get; set; } = string.Empty;
        
        public string? Brand { get; set; }
        
        public string? Model { get; set; }
        
        public decimal Price { get; set; }
        
        public int Rating { get; set; }
        
        public string? Speed { get; set; }
        
        public string? GPS { get; set; }
        
        public string? SeatType { get; set; }
        
        public string? Automatic { get; set; }
        
        public string? Description { get; set; }
        
        public string? ImgUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
