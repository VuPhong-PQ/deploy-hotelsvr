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
