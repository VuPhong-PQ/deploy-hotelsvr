import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate từ react-router-dom
import masterCard from "../../assets/all-images/master-card.jpg";
import paypal from "../../assets/all-images/paypal.jpg";
import "../../styles/payment-method.css";

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const navigate = useNavigate(); // Khai báo useNavigate

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleReserveNow = () => {
    if (!selectedPayment) {
      // Kiểm tra xem có phương thức thanh toán nào được chọn không
      alert("Please select a payment method before reserving."); // Hiển thị thông báo lỗi
      return; // Dừng thực hiện hàm nếu không có phương thức nào được chọn
    }
    
    alert("Reservation successful!"); // Hiển thị thông báo thành công
    navigate("/home"); // Chuyển hướng về trang home, hoặc có thể là trang xác nhận
  };

  return (
    <>
      <div className="payment">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            value="bankTransfer"
            checked={selectedPayment === "bankTransfer"}
            onChange={handlePaymentChange}
          />
          Direct Bank Transfer
        </label>
      </div>

      <div className="payment mt-3">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            value="cash"
            checked={selectedPayment === "cash"}
            onChange={handlePaymentChange}
          />
          Pay Cash
        </label>
      </div>

      <div className="payment mt-3 d-flex align-items-center justify-content-between">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            value="masterCard"
            checked={selectedPayment === "masterCard"}
            onChange={handlePaymentChange}
          />
          Master Card
        </label>
        <img src={masterCard} alt="Master Card" />
      </div>
      
      <div className="payment mt-3 d-flex align-items-center justify-content-between">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            value="room"
            checked={selectedPayment === "room"}
            onChange={handlePaymentChange}
          />
          Pay to room (will sign the bill when services)
        </label>
      </div>
      
      <div className="payment mt-3 d-flex align-items-center justify-content-between">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            value="paypal"
            checked={selectedPayment === "paypal"}
            onChange={handlePaymentChange}
          />
          Paypal
        </label>
        <img src={paypal} alt="Paypal" />
      </div>

      <div className="payment text-end mt-5">
        <button onClick={handleReserveNow}>Reserve Now</button> {/* Gọi handleReserveNow khi bấm nút */}
      </div>
   
    </>
  );
};

export default PaymentMethod;