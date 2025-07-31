import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane,
  Alert,
  Card,
  CardBody
} from 'reactstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDashboard } from '../../apis/admin.api';
import UserManagement from './UserManagement/UserManagement';
import ServiceManagement from './ServiceManagement/ServiceManagement';
import BlogManagement from './BlogManagement/BlogManagement';
import AdminDebug from './AdminDebug';
import AdminLogin from './AdminLogin';
import AdminContactMessages from './AdminContactMessages';
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
          <p>Vui lòng đăng nhập với tài khoản Admin.</p>
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

  const DashboardOverview = () => (
    <Row className="dashboard-cards">
      <Col md="4" sm="6" className="mb-4">
        <Card className="dashboard-card">
          <CardBody className="text-center">
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-number">
              {dashboardData?.stats?.totalUsers || 0}
            </div>
            <div className="card-title">Người dùng</div>
          </CardBody>
        </Card>
      </Col>
      <Col md="4" sm="6" className="mb-4">
        <Card className="dashboard-card">
          <CardBody className="text-center">
            <div className="card-icon">
              <i className="fas fa-concierge-bell"></i>
            </div>
            <div className="card-number">
              {dashboardData?.stats?.totalServices || 0}
            </div>
            <div className="card-title">Dịch vụ</div>
          </CardBody>
        </Card>
      </Col>
      <Col md="4" sm="6" className="mb-4">
        <Card className="dashboard-card">
          <CardBody className="text-center">
            <div className="card-icon">
              <i className="fas fa-blog"></i>
            </div>
            <div className="card-number">
              {dashboardData?.stats?.totalBlogs || 0}
            </div>
            <div className="card-title">Bài viết</div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="admin-dashboard">
      <Container fluid className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-tachometer-alt me-3"></i>
                Admin Dashboard
              </h1>
              <p className="subtitle">
                Chào mừng, {userCurrent?.fullName || userCurrent?.firstName}! 
                Quản lý hệ thống Hotel Services
              </p>
            </Col>
          </Row>
        </div>

        {/* Navigation */}
        <Nav tabs className="admin-nav">
          <NavItem>
            <NavLink
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => toggleTab('dashboard')}
            >
              <i className="fas fa-chart-line me-2"></i>
              Tổng quan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => toggleTab('users')}
            >
              <i className="fas fa-users me-2"></i>
              Quản lý người dùng
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'bookings' ? 'active' : ''}
              onClick={() => toggleTab('bookings')}
            >
              <i className="fas fa-calendar-check me-2"></i>
              Quản lý booking
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'services' ? 'active' : ''}
              onClick={() => toggleTab('services')}
            >
              <i className="fas fa-concierge-bell me-2"></i>
              Quản lý dịch vụ
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'blogs' ? 'active' : ''}
              onClick={() => toggleTab('blogs')}
            >
              <i className="fas fa-blog me-2"></i>
              Quản lý blog
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'contacts' ? 'active' : ''}
              onClick={() => toggleTab('contacts')}
            >
              <i className="fas fa-envelope me-2"></i>
              Quản lý liên hệ
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'debug' ? 'active' : ''}
              onClick={() => toggleTab('debug')}
            >
              <i className="fas fa-bug me-2"></i>
              Debug
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => toggleTab('login')}
            >
              <i className="fas fa-key me-2"></i>
              Admin Login
            </NavLink>
          </NavItem>
        </Nav>

        {/* Content */}
        <div className="admin-content">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="dashboard">
              <h3 className="mb-4">
                <i className="fas fa-chart-pie me-2"></i>
                Thống kê tổng quan
              </h3>
              <DashboardOverview />
            </TabPane>
            <TabPane tabId="users">
              <UserManagement />
            </TabPane>
            <TabPane tabId="bookings">
              {/* Trang quản lý booking */}
              {React.createElement(require('./AdminBookingManagement').default)}
            </TabPane>
            <TabPane tabId="services">
              <ServiceManagement />
            </TabPane>
            <TabPane tabId="blogs">
              <BlogManagement />
            </TabPane>
            <TabPane tabId="contacts">
              <AdminContactMessages />
            </TabPane>
            <TabPane tabId="debug">
              <AdminDebug />
            </TabPane>
            <TabPane tabId="login">
              <AdminLogin />
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
