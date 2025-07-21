import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane,
  Alert 
} from 'reactstrap';
import { useGetDashboard } from '../../apis/admin.api';
import ServicesManager from './ServicesManager';
import UserManager from './UserManager';
import SystemInfo from './SystemInfo';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userCurrent } = useAuth();
  const { data: dashboardData, isLoading, error } = useGetDashboard();

  // Kiểm tra quyền admin
  if (!userCurrent || userCurrent.role !== 'Admin') {
    return (
      <Container className="mt-5">
        <Alert color="danger" className="text-center">
          <h4>⛔ Truy cập bị từ chối</h4>
          <p>Bạn không có quyền truy cập vào trang quản trị.</p>
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner-admin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <Container>
          <Alert color="danger" className="alert-admin alert-admin-error">
            <h5>❌ Lỗi tải dữ liệu</h5>
            <p>{error.message}</p>
          </Alert>
        </Container>
      </div>
    );
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <Container fluid className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1>
            <i className="ri-dashboard-3-line"></i>
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="mb-0 text-muted">
            Chào mừng <strong>{userCurrent.name || userCurrent.firstName + ' ' + userCurrent.lastName}</strong> - Quản lý hệ thống Hotel Services
          </p>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <Row className="admin-stats">
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <CardBody>
                  <i className="ri-customer-service-2-line stat-icon services"></i>
                  <div className="stat-number">{dashboardData.totalServices || 0}</div>
                  <div className="stat-label">Dịch Vụ</div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <CardBody>
                  <i className="ri-user-line stat-icon users"></i>
                  <div className="stat-number">{dashboardData.totalUsers || 0}</div>
                  <div className="stat-label">Người Dùng</div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <CardBody>
                  <i className="ri-article-line stat-icon blogs"></i>
                  <div className="stat-number">{dashboardData.totalBlogs || 0}</div>
                  <div className="stat-label">Bài Viết</div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <CardBody>
                  <i className="ri-calendar-check-line stat-icon bookings"></i>
                  <div className="stat-number">{dashboardData.totalBookings || 0}</div>
                  <div className="stat-label">Đặt Phòng</div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Main Content */}
        <div className="admin-content">
          <Nav tabs className="admin-tabs">
            <NavItem>
              <NavLink
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => toggleTab('dashboard')}
                style={{ cursor: 'pointer' }}
              >
                <i className="ri-dashboard-line me-2"></i>
                Tổng Quan
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'services' ? 'active' : ''}
                onClick={() => toggleTab('services')}
                style={{ cursor: 'pointer' }}
              >
                <i className="ri-customer-service-2-line me-2"></i>
                Quản Lý Dịch Vụ
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => toggleTab('users')}
                style={{ cursor: 'pointer' }}
              >
                <i className="ri-user-settings-line me-2"></i>
                Quản Lý Người Dùng
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'system' ? 'active' : ''}
                onClick={() => toggleTab('system')}
                style={{ cursor: 'pointer' }}
              >
                <i className="ri-settings-3-line me-2"></i>
                Thông Tin Hệ Thống
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="dashboard">
              <Row>
                <Col md={12}>
                  <h4 className="mb-4">📊 Tổng Quan Hệ Thống</h4>
                  
                  {dashboardData && (
                    <Row>
                      <Col md={6}>
                        <Card className="mb-4">
                          <CardBody>
                            <h5 className="card-title">
                              <i className="ri-bar-chart-box-line text-primary me-2"></i>
                              Thống Kê Chung
                            </h5>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <strong>Tổng số dịch vụ:</strong> {dashboardData.totalServices} dịch vụ
                              </li>
                              <li className="mb-2">
                                <strong>Tổng số người dùng:</strong> {dashboardData.totalUsers} người
                              </li>
                              <li className="mb-2">
                                <strong>Tổng số bài viết:</strong> {dashboardData.totalBlogs} bài
                              </li>
                              <li className="mb-2">
                                <strong>Tổng số đặt phòng:</strong> {dashboardData.totalBookings} lượt
                              </li>
                            </ul>
                          </CardBody>
                        </Card>
                      </Col>
                      
                      <Col md={6}>
                        <Card className="mb-4">
                          <CardBody>
                            <h5 className="card-title">
                              <i className="ri-time-line text-success me-2"></i>
                              Hoạt Động Gần Đây
                            </h5>
                            <div className="alert alert-admin alert-admin-info">
                              <i className="ri-information-line me-2"></i>
                              Hệ thống đang hoạt động bình thường
                            </div>
                            <small className="text-muted">
                              Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                            </small>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
                  
                  <Alert color="info" className="alert-admin alert-admin-info">
                    <h6 className="mb-2">
                      <i className="ri-lightbulb-line me-2"></i>
                      Hướng Dẫn Sử Dụng
                    </h6>
                    <ul className="mb-0">
                      <li><strong>Quản Lý Dịch Vụ:</strong> Thêm, sửa, xóa dịch vụ và xuất/nhập Excel</li>
                      <li><strong>Quản Lý Người Dùng:</strong> Xem danh sách và phân quyền người dùng</li>
                      <li><strong>Thông Tin Hệ Thống:</strong> Kiểm tra trạng thái server và database</li>
                    </ul>
                  </Alert>
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId="services">
              <ServicesManager />
            </TabPane>

            <TabPane tabId="users">
              <UserManager />
            </TabPane>

            <TabPane tabId="system">
              <SystemInfo />
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
