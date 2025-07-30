
import React, { useState } from "react";
import "../../styles/booking-form.css";
import { Form, FormGroup } from "reactstrap";
import { useAddBooking } from "../../apis/booking.api";


const todayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  people: "1",
  address: "",
  note: "",
  serviceDate: todayStr(),
};

const BookingForm = ({ serviceId }) => {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccess = () => {
    setSuccess("Đặt dịch vụ thành công!");
    setError("");
    setForm(initialState);
  };
  const handleError = (err) => {
    setError("Đặt dịch vụ thất bại. Vui lòng thử lại.");
    setSuccess("");
  };

  const { mutate, isLoading } = useAddBooking({ handleSuccess, handleError });


  const submitHandler = (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    const payload = {
      serviceId,
      userId: null, // hoặc lấy từ context nếu có đăng nhập
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      numberOfPeople: parseInt(form.people, 10),
      totalAmount: 0, // hoặc tính theo service.price nếu muốn
      status: "Pending",
      address: form.address,
      notes: form.note,
      serviceDate: form.serviceDate,
      bookingDate: new Date().toISOString(),
    };
    console.log("Booking payload:", payload);
    mutate(payload);
  };

  return (
    <Form onSubmit={submitHandler}>
      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="text"
          placeholder="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <select
          name="people"
          value={form.people || "1"}
          onChange={handleChange}
          required
        >
          <option value="1">1 Person</option>
          <option value="2">2 Person</option>
          <option value="3">3 Person</option>
          <option value="4">4 Person</option>
          <option value="5">5+ Person</option>
        </select>
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <textarea
          rows={5}
          type="textarea"
          className="textarea"
          placeholder="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
        ></textarea>
      </FormGroup>
      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <label htmlFor="serviceDate" className="form-label">Ngày sử dụng dịch vụ</label>
        <input
          type="date"
          name="serviceDate"
          id="serviceDate"
          className="form-control"
          value={form.serviceDate}
          onChange={handleChange}
          min={todayStr()}
          required
        />
      </FormGroup>
      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <button className="btn btn-primary mt-2" type="submit" disabled={isLoading}>
        {isLoading ? "Đang gửi..." : "Đặt dịch vụ"}
      </button>
    </Form>
  );
};

export default BookingForm;
