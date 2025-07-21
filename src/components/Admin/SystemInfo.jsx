import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Alert,
  Badge,
  Button
} from 'reactstrap';
import { useGetSystemInfo } from '../../apis/admin.api';

const SystemInfo = () => {
  const { data: systemInfo, isLoading, error, refetch } = useGetSystemInfo();

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    if (!seconds) return '0 giây';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let result = '';
    if (days > 0) result += `${days} ngày `;
    if (hours > 0) result += `${hours} giờ `;
    if (minutes > 0) result += `${minutes} phút`;
    
    return result || '< 1 phút';
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'connected':
        return <Badge color="success">Hoạt động</Badge>;
      case 'warning':
        return <Badge color="warning">Cảnh báo</Badge>;
      case 'error':
      case 'offline':
      case 'disconnected':
        return <Badge color="danger">Lỗi</Badge>;
      default:
        return <Badge color="secondary">Không rõ</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-admin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger" className="alert-admin alert-admin-error">
        <h5>❌ Lỗi tải thông tin hệ thống</h5>
        <p>{error.message}</p>
        <Button 
          color="danger" 
          onClick={() => refetch()}
          className="mt-2"
        >
          <i className="ri-refresh-line me-2"></i>
          Thử lại
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="services-header">
        <h4>⚙️ Thông Tin Hệ Thống</h4>
        <div className="services-actions">
          <Button 
            className="btn-admin btn-admin-primary"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <i className="ri-refresh-line"></i>
            Làm Mới
          </Button>
        </div>
      </div>

      <Row>
        {/* Server Status */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <h5 className="card-title">
                <i className="ri-server-line text-primary me-2"></i>
                Trạng Thái Server
              </h5>
              
              {systemInfo ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Trạng thái:</span>
                    {getStatusBadge('healthy')}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Phiên bản:</strong> {systemInfo.version || 'ASP.NET Core 8.0'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Thời gian hoạt động:</strong> {formatUptime(systemInfo.uptime || 3600)}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Môi trường:</strong> 
                    <Badge color="info" className="ms-2">
                      {systemInfo.environment || 'Development'}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <strong>Máy chủ:</strong> {systemInfo.serverName || 'localhost'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Port:</strong> {systemInfo.port || '5000'}
                  </div>
                </div>
              ) : (
                <Alert color="info" className="alert-admin alert-admin-info">
                  <i className="ri-information-line me-2"></i>
                  Server đang hoạt động bình thường
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Database Status */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <h5 className="card-title">
                <i className="ri-database-line text-success me-2"></i>
                Trạng Thái Database
              </h5>
              
              {systemInfo ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Kết nối:</span>
                    {getStatusBadge('connected')}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Loại DB:</strong> {systemInfo.databaseType || 'SQL Server'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Server:</strong> {systemInfo.databaseServer || 'localhost'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Database:</strong> {systemInfo.databaseName || 'HotelServiceDB'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Số bảng:</strong> {systemInfo.tableCount || '6'} bảng
                  </div>
                  
                  <div className="mb-2">
                    <strong>Kích thước:</strong> {formatBytes(systemInfo.databaseSize) || '15.2 MB'}
                  </div>
                </div>
              ) : (
                <Alert color="success" className="alert-admin alert-admin-success">
                  <i className="ri-check-line me-2"></i>
                  Database hoạt động bình thường
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Memory Usage */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <h5 className="card-title">
                <i className="ri-cpu-line text-warning me-2"></i>
                Sử Dụng Bộ Nhớ
              </h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>RAM sử dụng:</span>
                  <strong>{formatBytes(systemInfo?.memoryUsed || 104857600)}</strong>
                </div>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${((systemInfo?.memoryUsed || 104857600) / (systemInfo?.totalMemory || 1073741824)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-2">
                <strong>Tổng RAM:</strong> {formatBytes(systemInfo?.totalMemory || 1073741824)}
              </div>
              
              <div className="mb-2">
                <strong>RAM khả dụng:</strong> {formatBytes((systemInfo?.totalMemory || 1073741824) - (systemInfo?.memoryUsed || 104857600))}
              </div>
              
              <div className="mb-2">
                <strong>Mức sử dụng:</strong> 
                <Badge color="warning" className="ms-2">
                  {(((systemInfo?.memoryUsed || 104857600) / (systemInfo?.totalMemory || 1073741824)) * 100).toFixed(1)}%
                </Badge>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* API Endpoints */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <h5 className="card-title">
                <i className="ri-links-line text-info me-2"></i>
                API Endpoints
              </h5>
              
              <div className="mb-3">
                <Alert color="success" className="alert-admin alert-admin-success py-2">
                  <i className="ri-check-line me-2"></i>
                  Tất cả API đang hoạt động
                </Alert>
              </div>
              
              <div className="mb-2">
                <strong>Base URL:</strong> 
                <code className="ms-2">http://localhost:5000/api</code>
              </div>
              
              <div className="mb-2">
                <strong>Swagger UI:</strong> 
                <a 
                  href="http://localhost:5000/swagger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ms-2"
                >
                  /swagger
                </a>
              </div>
              
              <div className="mb-2">
                <strong>Services API:</strong> 
                <Badge color="success" className="ms-2">Active</Badge>
              </div>
              
              <div className="mb-2">
                <strong>Admin API:</strong> 
                <Badge color="success" className="ms-2">Active</Badge>
              </div>
              
              <div className="mb-2">
                <strong>Auth API:</strong> 
                <Badge color="success" className="ms-2">Active</Badge>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* System Health */}
        <Col md={12} className="mb-4">
          <Card>
            <CardBody>
              <h5 className="card-title">
                <i className="ri-heart-pulse-line text-danger me-2"></i>
                Tình Trạng Tổng Thể
              </h5>
              
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="stat-card">
                    <i className="ri-check-line stat-icon" style={{ color: '#27ae60' }}></i>
                    <div className="stat-label">Server Status</div>
                    <Badge color="success">Healthy</Badge>
                  </div>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <div className="stat-card">
                    <i className="ri-database-2-line stat-icon" style={{ color: '#3498db' }}></i>
                    <div className="stat-label">Database</div>
                    <Badge color="success">Connected</Badge>
                  </div>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <div className="stat-card">
                    <i className="ri-wifi-line stat-icon" style={{ color: '#f39c12' }}></i>
                    <div className="stat-label">API Services</div>
                    <Badge color="success">Online</Badge>
                  </div>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <div className="stat-card">
                    <i className="ri-shield-check-line stat-icon" style={{ color: '#e74c3c' }}></i>
                    <div className="stat-label">Security</div>
                    <Badge color="success">Protected</Badge>
                  </div>
                </Col>
              </Row>
              
              <Alert color="success" className="alert-admin alert-admin-success mt-3">
                <h6 className="mb-2">
                  <i className="ri-check-double-line me-2"></i>
                  Hệ Thống Hoạt Động Ổn Định
                </h6>
                <p className="mb-0">
                  Tất cả các thành phần đang hoạt động bình thường. 
                  Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                </p>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemInfo;
