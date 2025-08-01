
import React from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/UI/HeroSlider";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import AboutSection from "../components/UI/AboutSection";
import { useGetAllServices } from "../apis/service.api";


function ServiceCard({ service }) {
  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="services_item">
        <div className="services_img">
          <img src={service.imgUrl} alt={service.serviceName} className="w-100" />
        </div>
        <div className="services_item-content mt-4">
          <h4 className="section__title text-center">{service.serviceName}</h4>
          <h6 className="rent__price text-center mt-">${service.price}.00 <span>/ Pax</span></h6>
          <div className="services_item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-restaurant-line"></i> {service.model}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-goblet-fill"></i> {service.automatic}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {service.speed}
            </span>
          </div>
          <Link to={`/booking?serviceId=${service.id}`} className="w-50 services_item-btn services_btn-rent text-center d-inline-block">
            Đặt dịch vụ
          </Link>
          <Link to={`/services/${service.id}`} className="w-50 services_item-btn services__btn-details text-center d-inline-block">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </Col>
  );
}

const Home = () => {
  const { data: services, isLoading, isError } = useGetAllServices();
  return (
    <Helmet title="Home">
      {/* ============= hero section =========== */}
      <section className="p-0 hero__slider-section">
        <HeroSlider />
      </section>
      {/* =========== about section ================ */}
      <AboutSection />
      {/* ========== dịch vụ từ SQL ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">Dịch vụ nổi bật</h6>
              <h2 className="section__title">Tất cả dịch vụ</h2>
            </Col>
            {isLoading && <p>Đang tải dịch vụ...</p>}
            {isError && <p>Lỗi khi tải dịch vụ.</p>}
            {services && services.length > 0 && services.map(service => (
              <ServiceCard service={service} key={service.id} />
            ))}
            {services && services.length === 0 && <p>Không có dịch vụ nào.</p>}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
