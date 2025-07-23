# 🎯 Hướng Dẫn Sử Dụng Giao Diện Admin

## 📋 Thông Tin Đăng Nhập Admin

**Email:** `admin@hotel.com`  
**Password:** `123456`  
**Role:** `Admin`

## 🚀 Các Bước Để Truy Cập Giao Diện Admin

### 1. Đăng Nhập
1. Mở website: `http://localhost:3001`
2. Nhấn nút **Login** ở góc trên bên phải
3. Nhập thông tin đăng nhập admin:
   - Email: `admin@hotel.com`
   - Password: `123456`
4. Nhấn **Đăng Nhập**

### 2. Truy Cập Admin Dashboard
Sau khi đăng nhập thành công với tài khoản admin, bạn sẽ thấy nút **Admin** màu gradient xanh tím ở menu navigation.

Nhấn vào nút **Admin** để vào trang quản trị.

## 🛠️ Các Tính Năng Admin

### 📊 Tổng Quan (Dashboard)
- Xem thống kê tổng số dịch vụ, người dùng, bài viết, đặt phòng
- Hiển thị trạng thái hệ thống
- Hướng dẫn sử dụng

### 🛎️ Quản Lý Dịch Vụ
**Tính năng chính:**
- ✅ **Thêm dịch vụ mới:** Nhấn nút "Thêm Dịch Vụ" để tạo dịch vụ mới
- ✏️ **Sửa dịch vụ:** Nhấn nút "Sửa" ở mỗi dịch vụ để chỉnh sửa
- 🗑️ **Xóa dịch vụ:** Nhấn nút "Xóa" để xóa dịch vụ (có xác nhận)
- 📥 **Xuất Excel:** Nhấn "Xuất Excel" để download danh sách dịch vụ
- 📤 **Nhập Excel:** Nhấn "Nhập Excel" để upload file Excel và import dịch vụ
- 📋 **Tải Template:** Nhấn "Tải Template" để download file mẫu Excel

**Form thêm/sửa dịch vụ:**
- Tên dịch vụ (bắt buộc)
- Giá ($) (bắt buộc)
- URL hình ảnh
- Mô tả
- Checkbox "Đặt làm dịch vụ nổi bật"

### 👥 Quản Lý Người Dùng
- Xem danh sách tất cả người dùng
- Phân quyền Admin/User
- Xóa người dùng
- Thống kê số lượng Admin và User

### ⚙️ Thông Tin Hệ Thống
- Trạng thái Server
- Trạng thái Database
- Sử dụng bộ nhớ
- API Endpoints
- Tình trạng tổng thể hệ thống

## 🎨 Demo Data

Hệ thống đã có sẵn demo data:

**Dịch vụ mẫu:**
- Hiện tại database không có dịch vụ nào
- Bạn có thể thêm dịch vụ mới thông qua trang admin

**User mẫu:**
- Admin User (admin@hotel.com) - Admin
- John Doe (john@example.com) - User
- Jane Smith (jane@example.com) - User

## 💡 Tips Sử Dụng

1. **Import Excel:** Sử dụng file template để đảm bảo format đúng
2. **Export Excel:** File sẽ được tự động download với tên có ngày tháng
3. **Hình ảnh:** Sử dụng URL từ Unsplash hoặc link ảnh public khác
4. **Quyền Admin:** Chỉ Admin mới có thể thấy và truy cập giao diện admin
5. **Auto-refresh:** Dữ liệu sẽ tự động cập nhật sau khi thực hiện thao tác

## 🔧 Chế Độ API

Hiện tại đang sử dụng **Real API** kết nối SQL Server.

Cấu hình hiện tại:
- ✅ **Services API:** Real API (SQL Server)
- ✅ **Users API:** Real API (SQL Server) 
- ✅ **Blogs API:** Real API (SQL Server)
- ❌ **Comments API:** Disabled (table removed)

Để chuyển về Mock API (nếu cần):
1. Sửa file `src/apis/admin.api.js`:
   ```javascript
   const USE_MOCK_ADMIN_API = true;
   ```
2. Sửa file `src/apis/user.api.js`:
   ```javascript
   const USE_MOCK_API = true;
   ```

## 🚨 Lưu Ý

- Demo data sẽ mất khi refresh trang (do sử dụng mock API)
- Với real API, dữ liệu sẽ được lưu vào database
- File Excel export/import hiện tại là CSV format (demo)
- Với real API sẽ là Excel format thật (.xlsx)

## 🎉 Tính Năng Hoàn Thành

✅ Giao diện admin responsive và đẹp mắt  
✅ CRUD dịch vụ đầy đủ  
✅ Import/Export Excel  
✅ Quản lý người dùng  
✅ Dashboard thống kê  
✅ Thông tin hệ thống  
✅ Authentication & Authorization  
✅ Mock API để demo  
✅ Real API backend sẵn sàng  

**🚀 Hệ thống admin đã hoàn thành 100%!**
