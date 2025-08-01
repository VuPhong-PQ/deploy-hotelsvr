import React from "react";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import { Container, Row, Col } from "reactstrap";

const Booking = () => {
  // Optionally, get serviceId from query params or state if needed
  return (
    <Helmet title="Đặt dịch vụ">
      <section>
        <Container>
          <Row>
            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5" id="booking-form">
                <h5 className="mb-4 fw-bold ">Booking Information</h5>
                <BookingForm />
              </div>
            </Col>
            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold ">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Booking;
