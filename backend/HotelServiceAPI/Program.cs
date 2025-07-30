using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HotelServiceAPI.Data;
using HotelServiceAPI.Repositories;
using HotelServiceAPI.Services;
using HotelServiceAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Entity Framework

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký HotelDbContext cho migration và API
builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
// builder.Services.AddScoped<ICommentRepository, CommentRepository>(); // DISABLED - TABLE REMOVED
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExcelService, ExcelService>();
builder.Services.AddScoped<ISqlServerService, SqlServerService>();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? "default-secret-key"))
    };
});

// Authorization
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
                "http://localhost:3002",
                "http://127.0.0.1:3002"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(origin => true);
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Thêm middleware logging
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    Console.WriteLine($"Origin: {context.Request.Headers["Origin"]}");
    await next.Invoke();
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});

// Static files
app.UseStaticFiles(); 

// SỬAA: Tạo thư mục uploads trước khi serve
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
var imagesPath = Path.Combine(uploadsPath, "images");

// Tạo thư mục nếu chưa tồn tại
Directory.CreateDirectory(uploadsPath);
Directory.CreateDirectory(imagesPath);

Console.WriteLine($"📁 Created uploads directory: {uploadsPath}");

// Serve uploads folder (sau khi đã tạo thư mục)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// Auto migrate và seed data
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        Console.WriteLine("🔄 Migrating database...");
        context.Database.Migrate();
        
        // Seed data
        if (!context.Users.Any())
        {
            Console.WriteLine("🌱 Seeding data...");
            
            var user = new User
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@hotel.com",
                Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            context.SaveChanges();

            var blog = new Blog
            {
                Title = "Welcome to Our Hotel",
                Content = "This is our first blog post about luxury hotel services.",
                ImageUrl = "/images/hotel1.jpg",
                Quote = "Luxury and comfort in every stay",
                AuthorId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Blogs.Add(blog);

            var blog2 = new Blog
            {
                Title = "Hotel Excellence",
                Content = "Our commitment to providing exceptional service and comfort.",
                ImageUrl = "/images/hotel2.jpg",
                Quote = "Excellence in hospitality",
                AuthorId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Blogs.Add(blog2);

            // Skip Services seeding for now to avoid foreign key issues
            // var service = new Service
            // {
            //     Name = "Room Cleaning",
            //     Description = "Professional room cleaning service",
            //     ImageUrl = "/images/cleaning.jpg",
            //     Icon = "fa-broom",
            //     Category = "Cleaning",
            //     Price = 50.00m,
            //     CreatedBy = user.Id,
            //     IsActive = true,
            //     CreatedAt = DateTime.UtcNow,
            //     UpdatedAt = DateTime.UtcNow
            // };
            // context.Services.Add(service);

            // var service2 = new Service
            // {
            //     Name = "Laundry Service",
            //     Description = "Professional laundry and dry cleaning",
            //     ImageUrl = "/images/laundry.jpg",
            //     Icon = "fa-tshirt",
            //     Category = "Laundry",
            //     Price = 25.00m,
            //     CreatedBy = user.Id,
            //     IsActive = true,
            //     CreatedAt = DateTime.UtcNow,
            //     UpdatedAt = DateTime.UtcNow
            // };
            // context.Services.Add(service2);

            context.SaveChanges();
            Console.WriteLine("✅ Data seeded successfully!");
        }
        else
        {
            Console.WriteLine("ℹ️ Database already has data, skipping seed.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database setup failed: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("🚀 API Starting...");
Console.WriteLine("📊 Available endpoints:");
Console.WriteLine("   GET  /api/blogs");
Console.WriteLine("   POST /api/blogs");
Console.WriteLine("   GET  /api/blogs/{id}");
Console.WriteLine("   PUT  /api/blogs/{id}");
Console.WriteLine("   DELETE /api/blogs/{id}");
Console.WriteLine("   GET  /api/blogs/my-blogs/{userId}");
Console.WriteLine("   POST /api/blogs/upload-image");
Console.WriteLine("   GET  /api/blogs/debug");
Console.WriteLine("   GET  /api/comments/blog/{blogId}");
Console.WriteLine("   GET  /api/comments/blog/{blogId}/with-permissions/{userId}");
Console.WriteLine("   POST /api/comments");
Console.WriteLine("   GET  /api/comments/{id}");
Console.WriteLine("   PUT  /api/comments/{id}");
Console.WriteLine("   DELETE /api/comments/{id}?userId={userId}");
Console.WriteLine("   DELETE /api/comments/batch");
Console.WriteLine("   GET  /api/comments/user/{userId}");
Console.WriteLine("   GET  /api/comments/debug");
Console.WriteLine("   GET  /swagger");

app.Run();