import React, { useEffect, useState } from "react";
import { fetchBookings, deleteBooking } from "../../apis/admin.booking.api";
import {
  Table,
  Input,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Alert,
} from "reactstrap";

const PAGE_SIZE = 10;

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa booking này?")) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Lỗi xóa booking");
    }
    setDeletingId(null);
  };

  const loadData = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchBookings({ search, page, pageSize: PAGE_SIZE, ...params });
      setBookings(res.bookings || res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Lỗi tải dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadData({ page: 1 });
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-booking-management">
      <h3 className="mb-4">
        <i className="fas fa-calendar-check me-2"></i>
        Quản lý Booking
      </h3>
      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, email, dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Button color="primary" type="submit">
          Tìm kiếm
        </Button>
      </form>
      {loading ? (
        <div className="text-center my-4">
          <Spinner color="primary" /> Đang tải dữ liệu...
        </div>
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <>
          <Table bordered responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày đặt</th>
                <th>Ngày sử dụng</th>
                <th>Số người</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Loại thanh toán</th>
                <th>Trạng thái thanh toán</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    Không có booking nào.
                  </td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b.id}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{b.user?.fullName || b.user?.firstName || "Khách vãng lai"}</td>
                    <td>{b.service?.name || b.serviceId}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : ""}</td>
                    <td>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : ""}</td>
                    <td>{b.numberOfPeople}</td>
                    <td>{b.totalAmount?.toLocaleString()} đ</td>
                    <td>{b.status}</td>
                    <td>{b.paymentMethod}</td>
                    <td>{b.paymentStatus}</td>
                    <td>{b.notes}</td>
                    <td>
                      <Button color="warning" size="sm" className="me-2" onClick={() => alert('Chức năng đang phát triển')}>Sửa</Button>
                      <Button color="danger" size="sm" disabled={deletingId === b.id} onClick={() => handleDelete(b.id)}>
                        {deletingId === b.id ? <Spinner size="sm" /> : "Xóa"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <PaginationItem disabled={page === 1}>
                <PaginationLink first onClick={() => setPage(1)} />
              </PaginationItem>
              <PaginationItem disabled={page === 1}>
                <PaginationLink previous onClick={() => setPage(page - 1)} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem active={page === i + 1} key={i}>
                  <PaginationLink onClick={() => setPage(i + 1)}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={page === totalPages}>
                <PaginationLink next onClick={() => setPage(page + 1)} />
              </PaginationItem>
              <PaginationItem disabled={page === totalPages}>
                <PaginationLink last onClick={() => setPage(totalPages)} />
              </PaginationItem>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBookingManagement;
