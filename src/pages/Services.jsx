import React from 'react';
import { Container, Row, Col, Card, CardBody, Badge, Button } from 'reactstrap';
import { useGetAllServices } from '../apis/service.api';
import { Link } from 'react-router-dom';
import config from '../config';
import '../styles/services.css';

const Services = () => {
  const { data: services, isLoading, error } = useGetAllServices();
  const [searchText, setSearchText] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  // Lấy danh sách nhóm dịch vụ từ dữ liệu
  const categories = React.useMemo(() => {
    if (!services) return [];
    return Array.from(new Set(services.map(s => s.category).filter(Boolean)));
  }, [services]);

  // Lọc dịch vụ theo tên và nhóm
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    return services.filter(s => {
      const matchName = s.name.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = selectedCategory ? s.category === selectedCategory : true;
      return matchName && matchCategory;
    });
  }, [services, searchText, selectedCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Spa': 'primary',
      'Ẩm thực': 'success', 
      'Thể thao': 'warning',
      'Giải trí': 'info',
      'Dịch vụ': 'secondary',
      'Khác': 'dark'
    };
    return colors[category] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="services-loading">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <h4 className="mt-3">Đang tải dịch vụ...</h4>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-error">
        <Container>
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
            <h4 className="text-danger mt-3">Lỗi tải dữ liệu</h4>
            <p className="text-muted">{error.message}</p>
            <Button color="primary" onClick={() => window.location.reload()}>
              <i className="fas fa-redo me-2"></i>
              Thử lại
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* XÓA NÚT SEARCH DƯ THỪA Ở ĐÂY (nếu có) */}
      {/* Bộ lọc tìm kiếm */}
      <div className="services-filter py-3">
        <Container>
          <Row className="align-items-center">
            <Col md="6" className="mb-2 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm tên dịch vụ..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </Col>
            <Col md="6">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả nhóm dịch vụ</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Hero Section */}
      <div className="services-hero">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg="6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Dịch Vụ Cao Cấp
                  <span className="text-primary d-block">Tại Khách Sạn</span>
                </h1>
                <p className="hero-subtitle">
                  Trải nghiệm những dịch vụ đẳng cấp quốc tế với tiêu chuẩn phục vụ 5 sao. 
                  Chúng tôi mang đến cho bạn những trải nghiệm không thể quên.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <h3>{services?.length || 0}</h3>
                    <p>Dịch vụ</p>
                  </div>
                  <div className="stat-item">
                    <h3>24/7</h3>
                    <p>Hỗ trợ</p>
                  </div>
                  <div className="stat-item">
                    <h3>5★</h3>
                    <p>Đánh giá</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="hero-image">
                <img
                  src={require("../assets/all-images/slider-img/toancanh.jpg")}
                  alt="Hotel Services"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{objectFit: 'cover', width: '100%', height: '340px'}}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Services Grid */}
      <div className="services-grid py-5">
        <Container>
          <Row>
            <Col lg="8" className="mx-auto text-center mb-5">
              <h2 className="section-title">Danh Sách Dịch Vụ</h2>
              <p className="section-subtitle">
                Khám phá các dịch vụ cao cấp được thiết kế đặc biệt để mang lại trải nghiệm tuyệt vời nhất
              </p>
            </Col>
          </Row>

          {filteredServices && filteredServices.length > 0 ? (
            <Row>
              {filteredServices.map((service, index) => {
                // Xử lý đường dẫn ảnh: nếu là đường dẫn tuyệt đối (http/https) thì giữ nguyên, nếu là đường dẫn tương đối thì thêm baseURL
                let imageUrl = service.imageUrl;
                if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
                  imageUrl = (config.apiBaseUrl?.replace(/\/$/, '') || '') + '/' + imageUrl.replace(/^\//, '');
                }
                imageUrl = imageUrl ? imageUrl + (service.updatedAt ? `?v=${new Date(service.updatedAt).getTime()}` : '') : 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                return (
                  <Col lg="4" md="6" className="mb-4" key={service.id}>
                    <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card className="service-card h-100 shadow-sm service-card-link" style={{ cursor: 'pointer' }}>
                        <div className="service-image-wrapper">
                          <img
                            src={imageUrl}
                            alt={service.name}
                            className="service-image"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                          <div className="service-overlay">
                            <Badge
                              color={getCategoryColor(service.category)}
                              className="service-category"
                            >
                              {service.category}
                            </Badge>
                          </div>
                        </div>
                        <CardBody className="service-body">
                          <div className="service-header">
                            <h5 className="service-name">{service.name}</h5>
                            <div className="service-price">
                              {formatPrice(service.price)}
                            </div>
                          </div>
                          <p className="service-description">
                            {service.description}
                          </p>
                          <div className="service-footer">
                            <div className="service-status">
                              {service.isActive ? (
                                <Badge color="success" className="status-badge">
                                  <i className="fas fa-check-circle me-1"></i>
                                  Đang hoạt động
                                </Badge>
                              ) : (
                                <Badge color="secondary" className="status-badge">
                                  <i className="fas fa-pause-circle me-1"></i>
                                  Tạm dừng
                                </Badge>
                              )}
                            </div>
                            <Button
                              color="primary"
                              size="sm"
                              className="book-btn"
                              disabled={!service.isActive}
                              onClick={e => {
                                e.preventDefault();
                                window.location.href = `/services/${service.id}#booking-form`;
                              }}
                            >
                              <i className="fas fa-calendar-plus me-1"></i>
                              Đặt ngay
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row>
              <Col lg="8" className="mx-auto text-center">
                <div className="empty-state py-5">
                  <i className="fas fa-concierge-bell text-muted" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 text-muted">Không tìm thấy dịch vụ phù hợp</h4>
                  <p className="text-muted">
                    Vui lòng thử lại với từ khóa hoặc nhóm dịch vụ khác.
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* CTA Section */}
      <div className="services-cta">
        <Container>
          <Row>
            <Col lg="8" className="mx-auto text-center">
              <div className="cta-content">
                <h3 className="cta-title">Cần hỗ trợ thêm?</h3>
                <p className="cta-subtitle">
                  Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                </p>
                <div className="cta-actions">
                  <Button color="primary" size="lg" className="me-3">
                    <i className="fas fa-phone me-2"></i>
                    Gọi ngay: 1900 1234
                  </Button>
                  <Button color="outline-primary" size="lg">
                    <i className="fas fa-envelope me-2"></i>
                    Gửi email
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Services;
