# Hotel Services API - Admin Features

## Tổng quan
Backend API được phát triển bằng C# ASP.NET Core với SQL Server, hỗ trợ đầy đủ các tính năng quản lý admin cho services.

## Tính năng Admin cho Services

### 🔐 Quyền truy cập
Tất cả các endpoint admin yêu cầu:
- **Authentication**: JWT Token
- **Authorization**: Role = "Admin"

### 📋 CRUD Operations

#### 1. Xem tất cả Services (bao gồm inactive)
```http
GET /api/services/admin/all
Authorization: Bearer {jwt_token}
```

#### 2. Tạo Service mới
```http
POST /api/services
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Tên dịch vụ",
  "description": "Mô tả chi tiết",
  "imageUrl": "https://example.com/image.jpg",
  "icon": "ri-icon-name",
  "price": 100000,
  "category": "Danh mục",
  "isActive": true,
  "createdBy": 1
}
```

#### 3. Cập nhật Service
```http
PUT /api/services/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Tên dịch vụ mới",
  "description": "Mô tả cập nhật",
  "imageUrl": "https://example.com/new-image.jpg",
  "icon": "ri-new-icon",
  "price": 150000,
  "category": "Danh mục mới",
  "isActive": true
}
```

#### 4. Xóa Service
```http
DELETE /api/services/{id}
Authorization: Bearer {jwt_token}
```

### 📊 Export/Import Excel

#### 1. Export Services ra Excel
```http
GET /api/services/export
Authorization: Bearer {jwt_token}
```
**Response**: File Excel (.xlsx) chứa tất cả services với đầy đủ thông tin.

#### 2. Download Template Excel
```http
GET /api/template/services-import
Authorization: Bearer {jwt_token}
```
**Response**: File template Excel mẫu để import services.

#### 3. Import Services từ Excel
```http
POST /api/services/import
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

file: [Excel file (.xlsx hoặc .xls)]
```

**Cấu trúc Excel Import:**
| Cột | Tên | Bắt buộc | Mô tả |
|-----|-----|----------|--------|
| A | ID | Không | Bỏ qua khi import |
| B | Tên dịch vụ | Có | Tên của service |
| C | Mô tả | Có | Mô tả chi tiết |
| D | Hình ảnh URL | Không | Link ảnh |
| E | Icon | Không | Icon class |
| F | Giá | Có | Giá dịch vụ (số) |
| G | Danh mục | Không | Danh mục |
| H | Trạng thái | Không | "Hoạt động" hoặc "Không hoạt động" |

### 🏛️ Admin Dashboard

#### Thống kê tổng quan
```http
GET /api/admin/dashboard
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "stats": {
    "totalUsers": 100,
    "totalServices": 50,
    "activeServices": 45,
    "inactiveServices": 5,
    "totalBlogs": 30,
    "totalComments": 150
  },
  "recentUsers": [...],
  "recentServices": [...]
}
```

#### Quản lý Users
```http
GET /api/admin/users
Authorization: Bearer {jwt_token}
```

#### Thay đổi Role User
```http
PUT /api/admin/users/{id}/role
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "role": "Admin" // hoặc "User"
}
```

#### Xóa User
```http
DELETE /api/admin/users/{id}
Authorization: Bearer {jwt_token}
```

#### Thông tin hệ thống
```http
GET /api/admin/system-info
Authorization: Bearer {jwt_token}
```

## 🗄️ Database Schema

### Service Model
```csharp
public class Service
{
    public int Id { get; set; }
    public string Name { get; set; }           // Bắt buộc, max 200 ký tự
    public string Description { get; set; }    // Bắt buộc
    public string? ImageUrl { get; set; }      // Tùy chọn, max 500 ký tự
    public string? Icon { get; set; }          // Tùy chọn, max 100 ký tự
    public decimal Price { get; set; }         // Bắt buộc, >= 0
    public string? Category { get; set; }      // Tùy chọn, max 50 ký tự
    public bool IsActive { get; set; }         // Mặc định: true
    public DateTime CreatedAt { get; set; }    // Tự động
    public DateTime UpdatedAt { get; set; }    // Tự động
    public int CreatedBy { get; set; }         // Foreign key to User
    public virtual User CreatedByUser { get; set; }
}
```

## 🚀 Cách chạy

1. **Cài đặt dependencies:**
```bash
dotnet restore
```

2. **Cập nhật database:**
```bash
dotnet ef database update
```

3. **Chạy API:**
```bash
dotnet run
```

4. **API sẽ chạy trên:**
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

## 📦 Packages sử dụng

- **EPPlus**: Xử lý Excel files
- **Entity Framework Core**: ORM
- **JWT Bearer**: Authentication
- **SQL Server**: Database

## 🔧 Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelServicesDB;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key",
    "Issuer": "HotelServiceAPI",
    "Audience": "HotelServiceAPI",
    "ExpireDays": 7
  }
}
```

## 📝 Notes

- File Excel phải có định dạng .xlsx hoặc .xls
- Import sẽ bỏ qua các dòng có lỗi và tiếp tục xử lý
- Admin không thể xóa admin cuối cùng trong hệ thống
- Tất cả endpoint admin đều có logging và error handling

## 🛡️ Security

- JWT Authentication với role-based authorization
- Validation đầu vào cho tất cả API
- SQL injection protection với Entity Framework
- CORS được cấu hình cho development

## 📞 Support

Nếu có vấn đề, vui lòng kiểm tra:
1. Database connection string
2. JWT token và role
3. File Excel format
4. API logs trong console
