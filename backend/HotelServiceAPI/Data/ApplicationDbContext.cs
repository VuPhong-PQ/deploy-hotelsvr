using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using HotelServiceAPI.Models;

namespace HotelServiceAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Comment> Comments { get; set; } // THÊM DÒNG NÀY NếU CHƯA CÓ
        public DbSet<Service> Services { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20).HasDefaultValue("User");
            });

            // Blog configuration
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.Quote).HasMaxLength(500);
                
                entity.HasOne(b => b.Author)
                      .WithMany()
                      .HasForeignKey(b => b.AuthorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Comment configuration - SỬA SECTION NÀY
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.GuestName).HasMaxLength(100);
                entity.Property(e => e.GuestEmail).HasMaxLength(100);
                
                entity.HasOne(c => c.Blog)
                      .WithMany()
                      .HasForeignKey(c => c.BlogId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                // SỬA: UserId có thể null
                entity.HasOne(c => c.User)
                      .WithMany()
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.SetNull) // Thay đổi thành SetNull
                      .IsRequired(false); // UserId không bắt buộc
            });

            // Service configuration
            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.Icon).HasMaxLength(50);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                
                // Fix the foreign key property name
                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(s => s.CreatedBy) // Make sure this matches your Service model property
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}