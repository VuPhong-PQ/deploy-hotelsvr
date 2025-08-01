import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useGetAllServices } from "../../apis/service.api";
import { fetchBookings, deleteBooking, updateBooking, createBooking } from "../../apis/admin.booking.api";
import {
  Table,
  Input,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
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
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const { data: services } = useGetAllServices();
  const [saving, setSaving] = useState(false);
  const openEditModal = (booking) => {
    setEditData({ ...booking });
    setEditModal(true);
  };

  // Open modal for creating new booking
  const openCreateModal = () => {
    setEditData({
      userId: '',
      serviceId: '',
      bookingDate: '',
      serviceDate: '',
      numberOfPeople: 1,
      totalAmount: 0,
      status: 'Pending',
      paymentMethod: 'Cash',
      paymentStatus: 'Unpaid',
      notes: ''
    });
    setEditModal(true);
  };

  // Export bookings to Excel
  const handleExportExcel = () => {
    if (!bookings || bookings.length === 0) return;
    const data = bookings.map((b, idx) => ({
      "#": (page - 1) * PAGE_SIZE + idx + 1,
      "Khách hàng": b.user?.fullName || b.user?.firstName || "Khách vãng lai",
      "Dịch vụ": b.service?.name || b.serviceId,
      "Ngày đặt": b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "",
      "Ngày sử dụng": b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "",
      "Số người đặt ban đầu": b.numberOfPeople || 1,
      "Tổng tiền sau khi sửa": b.totalAmount?.toLocaleString() + " đ",
      "Tổng tiền đặt ban đầu": (() => {
        const service = services?.find(s => s.id === Number(b.serviceId));
        const price = service ? Number(service.price) : 0;
        const total = price * (b.numberOfPeople || 1);
        return total.toLocaleString() + " đ";
      })(),
      "Trạng thái sd dịch vụ": b.status,
      "Loại thanh toán": b.paymentMethod,
      "Trạng thái thanh toán": b.paymentStatus,
      "Ghi chú khách hàng": b.notes,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `Bookings_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Auto-calculate totalAmount when serviceId or numberOfPeople changes
  useEffect(() => {
    if (!editModal || !editData || !services) return;
    const { serviceId, numberOfPeople } = editData;
    const service = services.find((s) => s.id === Number(serviceId));
    if (service && numberOfPeople) {
      const price = Number(service.price) || 0;
      const people = Number(numberOfPeople) || 1;
      const newTotal = price * people;
      if (editData.totalAmount !== newTotal) {
        setEditData((prev) => ({ ...prev, totalAmount: newTotal }));
      }
    }
  }, [editData?.serviceId, editData?.numberOfPeople, services, editModal]);

  const closeEditModal = () => {
    setEditModal(false);
    setEditData(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    // Validate required fields
    const isNew = !editData.id;
    const {
      userId,
      serviceId,
      bookingDate,
      serviceDate,
      numberOfPeople,
      status,
      paymentMethod,
      paymentStatus
    } = editData;
    if (!serviceId || !bookingDate || !serviceDate || !numberOfPeople || !status || !paymentMethod || !paymentStatus) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    // Convert types for backend, chuẩn hóa ngày tháng ISO
    const toISO = (dateStr, withTime = false) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (withTime) return d.toISOString();
      // Chỉ lấy yyyy-MM-dd nếu không cần giờ
      return d.toISOString().slice(0, 10);
    };
    const payload = {
      ...editData,
      userId: userId ? Number(userId) : null,
      serviceId: Number(serviceId),
      numberOfPeople: Number(numberOfPeople),
      totalAmount: Number(editData.totalAmount) || 0,
      bookingDate: toISO(bookingDate, true),
      serviceDate: toISO(serviceDate, false)
    };
    setSaving(true);
    try {
      if (isNew) {
        // Debug: log payload
        console.log('Tạo booking mới với payload:', payload);
        await createBooking(payload);
      } else {
        await updateBooking(editData.id, payload);
      }
      setPage(1);
      await loadData({ page: 1 });
      closeEditModal();
    } catch (err) {
      // Debug: log error chi tiết
      console.error('Lỗi tạo/cập nhật booking:', err, err?.response);
      let msg = err?.response?.data?.message || err.message || (isNew ? "Lỗi tạo booking" : "Lỗi cập nhật booking");
      if (err?.response?.data) {
        msg += '\n' + JSON.stringify(err.response.data);
      }
      alert(msg);
    }
    setSaving(false);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa booking này?")) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      setPage(1);
      await loadData({ page: 1 });
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Lỗi xóa booking");
    }
    setDeletingId(null);
  };

  const loadData = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const pageParam = params.page !== undefined ? params.page : page;
      const res = await fetchBookings({ search, page: pageParam, pageSize: PAGE_SIZE, ...params });
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
      <div className="d-flex mb-3 align-items-center">
        <Button color="primary" className="me-2" onClick={openCreateModal}>
          <i className="fas fa-plus me-1"></i> Thêm booking
        </Button>
        <Button color="success" className="me-2" onClick={handleExportExcel}>
          <i className="fas fa-file-excel me-1"></i> Xuất Excel
        </Button>
        <form className="d-flex flex-grow-1" onSubmit={handleSearch}>
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
      </div>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Dịch vụ</th>
                <th>Ngày đặt</th>
                <th>Ngày sử dụng</th>
                <th>Số người</th>
                <th>Tổng tiền đặt ban đầu</th>
                <th>Trạng thái sd dịch vụ</th>
                <th>Loại thanh toán</th>
                <th>Trạng thái thanh toán</th>
                <th>Ghi chú khách hàng</th>
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
                    <td>{b.user?.fullName || b.firstName || "Khách vãng lai"}</td>
                    <td>{b.firstName || ''}</td>
                    <td>{b.lastName || ''}</td>
                    <td>{b.email || ''}</td>
                    <td>{b.phone || ''}</td>
                    <td>{b.address || ''}</td>
                    <td>{b.service?.name || b.serviceId}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : ""}</td>
                    <td>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : ""}</td>
                    <td>{b.numberOfPeople || 1}</td>
                    <td>{(() => {
                      const service = services?.find(s => s.id === Number(b.serviceId));
                      const price = service ? Number(service.price) : 0;
                      const total = price * (b.numberOfPeople || 1);
                      return total.toLocaleString() + ' đ';
                    })()}</td>
                    <td>{b.status}</td>
                    <td>{b.paymentMethod}</td>
                    <td>{b.paymentStatus}</td>
                    <td>{b.notes}</td>
                    <td>
                      <Button color="warning" size="sm" className="me-2" onClick={() => openEditModal(b)}>Sửa</Button>
      {/* Modal chỉnh sửa booking */}
      <Modal isOpen={editModal} toggle={closeEditModal}>
        <ModalHeader toggle={closeEditModal}>Chỉnh sửa Booking</ModalHeader>
        <ModalBody>
          {editData && (
            <Form>
              <FormGroup>
                <Label>Khách hàng (UserId)</Label>
                <Input type="number" name="userId" value={editData.userId || ''} onChange={handleEditChange} min={1} />
              </FormGroup>
              <FormGroup>
                <Label>First Name</Label>
                <Input type="text" name="firstName" value={editData.firstName || ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input type="text" name="lastName" value={editData.lastName || ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={editData.email || ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Số điện thoại</Label>
                <Input type="text" name="phone" value={editData.phone || ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Địa chỉ</Label>
                <Input type="text" name="address" value={editData.address || ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Dịch vụ (ServiceId)</Label>
                <Input
                  type="select"
                  name="serviceId"
                  value={editData.serviceId || ''}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {services && services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Giá: {s.price?.toLocaleString()} đ)
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Ngày đặt</Label>
                <Input type="datetime-local" name="bookingDate" value={editData.bookingDate ? new Date(editData.bookingDate).toISOString().slice(0,16) : ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Ngày sử dụng</Label>
                <Input type="date" name="serviceDate" value={editData.serviceDate ? new Date(editData.serviceDate).toISOString().slice(0,10) : ''} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Số người</Label>
                <Input type="number" name="numberOfPeople" value={editData.numberOfPeople || 1} min={1} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <Label>Tổng tiền</Label>
                <Input
                  type="number"
                  name="totalAmount"
                  value={editData.totalAmount || 0}
                  min={0}
                  step={1000}
                  readOnly
                  style={{ background: '#f5f5f5' }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Số Tiề ban đàu</Label>
                <Input type="select" name="status" value={editData.status || ''} onChange={handleEditChange}>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Loại thanh toán</Label>
                <Input type="select" name="paymentMethod" value={editData.paymentMethod || ''} onChange={handleEditChange}>
                  <option value="Cash">Cash</option>
                  <option value="CreditCard">CreditCard</option>
                  <option value="Momo">Momo</option>
                  <option value="Zalo">Zalo</option>
                  <option value="BankTransfer">Bank Transfer</option>
                  <option value="Paypal">Paypal</option>
                  <option value="PayToRoom">Pay to room</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Trạng thái thanh toán</Label>
                <Input type="select" name="paymentStatus" value={editData.paymentStatus || ''} onChange={handleEditChange}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Ghi chú</Label>
                <Input type="text" name="notes" value={editData.notes || ''} onChange={handleEditChange} />
              </FormGroup>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeEditModal} disabled={saving}>Hủy</Button>
          <Button color="primary" onClick={handleEditSave} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Lưu'}</Button>
        </ModalFooter>
      </Modal>
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
