[---]
# NGHIỆP VỤ BACKEND HỆ THỐNG & SƠ ĐỒ USECASE

## Mô tả nghiệp vụ backend

Backend của hệ thống đảm nhận các nghiệp vụ sau:

1. **Quản lý dịch vụ**
   - Tạo, sửa, xóa, cập nhật thông tin dịch vụ (spa, nhà hàng, đưa đón, v.v.).
   - Xử lý yêu cầu lấy danh sách dịch vụ cho frontend.

2. **Quản lý đặt dịch vụ**
   - Nhận yêu cầu đặt dịch vụ từ khách hàng.
   - Xác nhận, cập nhật trạng thái, hủy đơn đặt dịch vụ.
   - Lưu trữ lịch sử đặt dịch vụ.

3. **Quản lý người dùng**
   - Đăng ký, đăng nhập, xác thực người dùng (JWT).
   - Quản lý thông tin cá nhân, phân quyền (admin, user).

4. **Quản lý blog/tin tức**
   - Tạo, sửa, xóa bài viết về khách sạn, dịch vụ, sự kiện.
   - Cung cấp API cho frontend hiển thị và bình luận.

5. **Quản lý bình luận/đánh giá**
   - Nhận, lưu trữ, kiểm duyệt bình luận/đánh giá của khách hàng về dịch vụ.
   - Xóa hoặc ẩn bình luận không phù hợp.

6. **Quản lý liên hệ/yêu cầu hỗ trợ**
   - Nhận và lưu trữ các yêu cầu hỗ trợ từ khách hàng.
   - Quản trị viên phản hồi qua hệ thống.

7. **Quản lý tài nguyên**
   - Lưu trữ và cung cấp hình ảnh, tài liệu liên quan đến dịch vụ.

## Sơ đồ usecase backend

### Các tác nhân (Actors)
- Khách hàng (User)
- Quản trị viên (Admin)
- Hệ thống frontend (Client)

### Các usecase chính

#### Khách hàng (thông qua frontend)
- Đăng ký/Đăng nhập (API)
- Tìm kiếm dịch vụ (API)
- Xem chi tiết dịch vụ (API)
- Đặt dịch vụ (API)
- Đăng ký dịch vụ (API)
- Xem blog/tin tức (API)
- Bình luận/Đánh giá (API)
- Gửi liên hệ/yêu cầu hỗ trợ (API)

#### Quản trị viên
- Quản lý dịch vụ (CRUD API)
- Quản lý đơn đặt dịch vụ (CRUD API)
- Quản lý blog/tin tức (CRUD API)
- Quản lý bình luận/đánh giá (CRUD API)
- Quản lý liên hệ/yêu cầu (CRUD API)
- Quản lý người dùng (CRUD API)
- Quản lý tài nguyên (CRUD API)

### Sơ đồ usecase backend (mô tả dạng text)

```
[Khách hàng] ---> (Gửi yêu cầu API: Đăng ký/Đăng nhập)
[Khách hàng] ---> (Gửi yêu cầu API: Tìm kiếm dịch vụ) ---> (Xem chi tiết dịch vụ) ---> (Đặt dịch vụ)
[Khách hàng] ---> (Gửi yêu cầu API: Đăng ký dịch vụ)
[Khách hàng] ---> (Gửi yêu cầu API: Xem blog/tin tức) ---> (Bình luận/Đánh giá)
[Khách hàng] ---> (Gửi yêu cầu API: Gửi liên hệ/yêu cầu hỗ trợ)

[Quản trị viên] ---> (CRUD API: Quản lý dịch vụ)
[Quản trị viên] ---> (CRUD API: Quản lý đơn đặt dịch vụ)
[Quản trị viên] ---> (CRUD API: Quản lý blog/tin tức)
[Quản trị viên] ---> (CRUD API: Quản lý bình luận/đánh giá)
[Quản trị viên] ---> (CRUD API: Quản lý liên hệ/yêu cầu)
[Quản trị viên] ---> (CRUD API: Quản lý người dùng)
[Quản trị viên] ---> (CRUD API: Quản lý tài nguyên)
```
# NGHIỆP VỤ HỆ THỐNG KÈM SƠ ĐỒ USECASE

## Mô tả nghiệp vụ hệ thống

Hệ thống quản lý dịch vụ khách sạn bao gồm các nghiệp vụ chính sau:

1. **Quản lý đặt dịch vụ (Service Booking Management)**
   - Khách hàng tìm kiếm dịch vụ, xem chi tiết dịch vụ, thực hiện đặt dịch vụ.
   - Quản trị viên xác nhận, chỉnh sửa, hoặc hủy các đơn đặt dịch vụ.

2. **Quản lý dịch vụ khách sạn (Service Management)**
   - Hiển thị danh sách các dịch vụ (spa, nhà hàng, đưa đón, v.v.).
   - Khách hàng có thể đăng ký sử dụng dịch vụ kèm theo đặt dịch vụ.

3. **Quản lý blog/tin tức (Blog Management)**
   - Quản trị viên đăng bài viết, chỉnh sửa, xóa bài viết về khách sạn, dịch vụ, sự kiện.
   - Khách hàng xem và bình luận các bài viết.

4. **Quản lý bình luận/đánh giá (Comment & Review Management)**
   - Khách hàng gửi bình luận, đánh giá về dịch vụ.
   - Quản trị viên kiểm duyệt, xóa bình luận không phù hợp.

5. **Quản lý liên hệ (Contact Management)**
   - Khách hàng gửi yêu cầu hỗ trợ, phản hồi qua form liên hệ.
   - Quản trị viên tiếp nhận, phản hồi các yêu cầu liên hệ.

6. **Quản lý người dùng (User Management)**
   - Đăng ký, đăng nhập, xác thực người dùng.
   - Quản trị viên quản lý thông tin người dùng, phân quyền.

7. **Quản lý tài nguyên (Resource Management)**
   - Quản lý hình ảnh, tài liệu liên quan đến dịch vụ.

## Sơ đồ Usecase thực tế

### Các tác nhân (Actors)
- Khách hàng (User)
- Quản trị viên (Admin)

### Các usecase chính

#### Khách hàng
- Đăng ký/Đăng nhập
- Tìm kiếm dịch vụ
- Xem chi tiết dịch vụ
- Đặt dịch vụ
- Đăng ký dịch vụ
- Xem blog/tin tức
- Bình luận/Đánh giá
- Gửi liên hệ/yêu cầu hỗ trợ

#### Quản trị viên
- Quản lý dịch vụ
- Quản lý đơn đặt dịch vụ
- Quản lý blog/tin tức
- Quản lý bình luận/đánh giá
- Quản lý liên hệ/yêu cầu
- Quản lý người dùng
- Quản lý tài nguyên

### Sơ đồ usecase (mô tả dạng text)

```
[Khách hàng] ---> (Đăng ký/Đăng nhập)
[Khách hàng] ---> (Tìm kiếm dịch vụ) ---> (Xem chi tiết dịch vụ) ---> (Đặt dịch vụ)
[Khách hàng] ---> (Đăng ký dịch vụ)
[Khách hàng] ---> (Xem blog/tin tức) ---> (Bình luận/Đánh giá)
[Khách hàng] ---> (Gửi liên hệ/yêu cầu hỗ trợ)

[Quản trị viên] ---> (Quản lý dịch vụ)
[Quản trị viên] ---> (Quản lý đơn đặt dịch vụ)
[Quản trị viên] ---> (Quản lý blog/tin tức)
[Quản trị viên] ---> (Quản lý bình luận/đánh giá)
[Quản trị viên] ---> (Quản lý liên hệ/yêu cầu)
[Quản trị viên] ---> (Quản lý người dùng)
[Quản trị viên] ---> (Quản lý tài nguyên)
```
