

import React from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/UI/HeroSlider";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import AboutSection from "../components/UI/AboutSection";
import { useGetAllServices } from "../apis/service.api";
import BlogList from "../components/UI/BlogList";


function ServiceCard({ service }) {
  // Sử dụng đúng trường imageUrl (camelCase) từ backend/API
  let imgSrc = service.imageUrl;
  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
  if (imgSrc) {
    imgSrc = imgSrc.replace(/\\/g, "/");
    // Nếu là đường dẫn tuyệt đối (http/https) thì giữ nguyên
    if (!/^https?:\/\//i.test(imgSrc)) {
      // Nếu đã có /uploads hoặc uploads ở đầu thì chỉ nối domain
      if (/^\/uploads\//i.test(imgSrc) || /^uploads\//i.test(imgSrc)) {
        imgSrc = `${apiBase.replace(/\/+$/, "")}/${imgSrc.replace(/^\/+/, "")}`;
      } else {
        imgSrc = `${apiBase.replace(/\/+$/, "")}/uploads/${imgSrc.replace(/^\/+/, "")}`;
      }
    }
  } else {
    imgSrc = "/assets/default-service.jpg";
  }
  // Nếu ảnh lỗi, fallback về ảnh mặc định
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = "/assets/default-service.jpg";
  };
  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="services_item">
        <div className="services_img">
          <img src={imgSrc} alt={service.serviceName} className="w-100" style={{objectFit: "cover", height: 220}} onError={handleImgError} />
        </div>
        <div className="services_item-content mt-4">
          <h4 className="section__title text-center">{service.serviceName}</h4>
          <h6 className="rent__price text-center mt-">
            {service.price != null ?
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
              : ''}
            <span> / Pax</span>
          </h6>
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
          <Link to={`/services/${service.id}#booking-form`} className="w-50 services_item-btn services_btn-rent text-center d-inline-block">
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
              <h6 className="section__subtitle">Featured Services</h6>
              <h2 className="section__title">All Services</h2>
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

      {/* ========== Blog section ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">Latest Blogs</h6>
              <h2 className="section__title">From Our Blog</h2>
            </Col>
            <BlogList />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
