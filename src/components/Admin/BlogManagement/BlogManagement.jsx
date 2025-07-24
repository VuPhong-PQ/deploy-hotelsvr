import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert
} from 'reactstrap';
import { 
  useGetAllBlogsAdmin,
  useDeleteBlog
} from '../../../apis/admin.api';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  // Queries và Mutations
  const { data: blogs, isLoading, error, refetch } = useGetAllBlogsAdmin();
  const deleteMutation = useDeleteBlog();

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await deleteMutation.mutateAsync(blogId);
        addAlert('Xóa bài viết thành công!');
        refetch();
      } catch (error) {
        addAlert(error.message || 'Có lỗi xảy ra khi xóa!', 'error');
      }
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
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
        <h5>❌ Lỗi tải dữ liệu</h5>
        <p>{error.message}</p>
      </Alert>
    );
  }

  return (
    <div>
      {/* Alerts */}
      {alerts.map(alert => (
        <Alert 
          key={alert.id} 
          color={alert.type === 'error' ? 'danger' : 'success'}
          className={`alert-admin ${alert.type === 'error' ? 'alert-admin-error' : 'alert-admin-success'}`}
        >
          {alert.message}
        </Alert>
      ))}

      {/* Header với Card */}
      <div className="admin-header-card">
        <Row className="align-items-center">
          <Col>
            <div className="admin-header-content">
              <h3 className="admin-title">
                <i className="fas fa-blog me-3"></i>
                Quản lý blog
              </h3>
              <p className="admin-subtitle">Quản lý tất cả bài viết từ tất cả người dùng</p>
            </div>
          </Col>
          <Col xs="auto">
            <Button 
              className="btn-admin btn-admin-primary"
              onClick={() => navigate('/create-blog')}
            >
              <i className="fas fa-plus me-2"></i>
              Thêm bài viết
            </Button>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md="4">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-blog"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{blogs?.length || 0}</h4>
              <p>Tổng bài viết</p>
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{blogs ? new Set(blogs.map(blog => blog.author?.id)).size : 0}</h4>
              <p>Tác giả</p>
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{blogs ? blogs.filter(blog => {
                const today = new Date();
                const created = new Date(blog.createdAt);
                return created.toDateString() === today.toDateString();
              }).length : 0}</h4>
              <p>Hôm nay</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Table Card */}
      <div className="admin-table-card">
        <Table responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs && blogs.length > 0 ? (
              blogs.map(blog => (
                <tr key={blog.id}>
                  <td>
                    <span className="admin-id-badge">{blog.id}</span>
                  </td>
                  <td>
                    <div className="admin-title-content">
                      <div className="fw-bold text-primary">{blog.title}</div>
                      {blog.quote && (
                        <small className="text-muted fst-italic">"{blog.quote}"</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-user-info">
                      <div className="admin-user-avatar">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="admin-user-details">
                        <div className="admin-user-name">
                          {blog.author?.fullName || blog.author?.firstName + ' ' + blog.author?.lastName || 'Unknown'}
                        </div>
                        <small className="admin-user-email">{blog.author?.email || 'N/A'}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-content-preview">
                      {truncateContent(blog.content)}
                    </div>
                  </td>
                  <td>
                    <div className="admin-date">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="admin-date">
                      {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Button 
                        className="btn-action btn-action-view"
                        size="sm"
                        onClick={() => window.open(`/blogs/${blog.id}`, '_blank')}
                        title="Xem bài viết"
                      >
                        <i className="fas fa-eye me-1"></i>
                        Xem
                      </Button>
                      <Button 
                        className="btn-action btn-action-edit"
                        size="sm"
                        onClick={() => navigate(`/edit-blog/${blog.id}`)}
                        title="Chỉnh sửa bài viết"
                      >
                        <i className="fas fa-edit me-1"></i>
                        Sửa
                      </Button>
                      <Button 
                        className="btn-action btn-action-delete"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleteMutation.isLoading}
                        title="Xóa bài viết"
                      >
                        <i className="fas fa-trash me-1"></i>
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center admin-no-data">
                  <div className="admin-empty-state">
                    <i className="fas fa-blog fa-3x text-muted mb-3"></i>
                    <h5>Chưa có bài viết nào</h5>
                    <p className="text-muted">Hãy thêm bài viết đầu tiên của bạn</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BlogManagement;
