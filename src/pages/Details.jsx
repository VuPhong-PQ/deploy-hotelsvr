import React, { useEffect } from "react";
import { useGetServiceById } from "../apis/service.api";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useParams } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import config from '../config';

const Details = () => {
  const { id } = useParams();
  const { data: service, isLoading, error } = useGetServiceById(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-5">Đang tải dữ liệu dịch vụ...</div>;
  }
  if (error || !service) {
    return <div className="text-center py-5 text-danger">Không tìm thấy dịch vụ hoặc có lỗi xảy ra.</div>;
  }

  return (
    <Helmet title={service.name}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              {(() => {
                let imageUrl = service.imageUrl;
                if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
                  imageUrl = (config.apiBaseUrl?.replace(/\/$/, '') || '') + '/' + imageUrl.replace(/^\//, '');
                }
                imageUrl = imageUrl ? imageUrl + (service.updatedAt ? `?v=${new Date(service.updatedAt).getTime()}` : '') : 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                return (
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-100"
                    onError={e => {
                      e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                );
              })()}
            </Col>
            <Col lg="6">
              <div className="service__info">
                <h2 className="section__title">{service.name}</h2>
                <div className="d-flex align-items-center gap-5 mb-4 mt-3">
                  <h6 className="rent__price fw-bold fs-4">
                    {service.price?.toLocaleString('vi-VN')} VNĐ
                  </h6>
                </div>
                <p className="section__description">
                  {service.description}
                </p>
                <div className="d-flex align-items-center mt-3" style={{ columnGap: "2.8rem" }}>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className={service.icon || "fas fa-concierge-bell"} style={{ color: "#f9a826" }}></i>{" "}
                    {service.category}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="fas fa-check-circle" style={{ color: service.isActive ? '#28a745' : '#ccc' }}></i>{" "}
                    {service.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>
            </Col>
            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5" id="booking-form">
                <h5 className="mb-4 fw-bold ">Booking Information</h5>
                <BookingForm serviceId={service.id} />
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

export default Details;
