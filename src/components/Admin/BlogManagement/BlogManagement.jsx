import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Table, 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Badge,
  ButtonGroup
} from 'reactstrap';
import { 
  useGetAllBlogsAdmin,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog
} from '../../../apis/admin.api';

const BlogManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    quote: '',
    imageUrl: ''
  });
  const [alerts, setAlerts] = useState([]);

  // Queries và Mutations
  const { data: blogs, isLoading, error, refetch } = useGetAllBlogsAdmin();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        quote: blog.quote || '',
        imageUrl: blog.imageUrl || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        quote: '',
        imageUrl: ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      quote: '',
      imageUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateMutation.mutateAsync({
          id: editingBlog.id,
          blogData: formData
        });
        addAlert('Cập nhật bài viết thành công!');
      } else {
        await createMutation.mutateAsync(formData);
        addAlert('Thêm bài viết thành công!');
      }
      closeModal();
      refetch();
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra!', 'error');
    }
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

      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <h3>
            <i className="fas fa-blog me-2"></i>
            Quản lý blog
          </h3>
          <p className="text-muted">Quản lý tất cả bài viết từ tất cả người dùng</p>
        </Col>
        <Col xs="auto">
          <Button 
            className="btn-admin btn-admin-primary"
            onClick={() => openModal()}
          >
            <i className="fas fa-plus me-2"></i>
            Thêm bài viết
          </Button>
        </Col>
      </Row>

      {/* Table */}
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
                <td>{blog.id}</td>
                <td>
                  <div className="fw-bold">{blog.title}</div>
                  {blog.quote && (
                    <small className="text-muted fst-italic">"{blog.quote}"</small>
                  )}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-user-circle me-2"></i>
                    {blog.author?.fullName || blog.author?.firstName + ' ' + blog.author?.lastName || 'Unknown'}
                  </div>
                </td>
                <td>
                  <div className="text-muted">
                    {truncateContent(blog.content)}
                  </div>
                </td>
                <td>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td>
                  {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td>
                  <ButtonGroup size="sm">
                    <Button 
                      className="btn-admin btn-admin-info"
                      onClick={() => window.open(`/blogs/${blog.id}`, '_blank')}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button 
                      className="btn-admin btn-admin-warning"
                      onClick={() => openModal(blog)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      className="btn-admin btn-admin-danger"
                      onClick={() => handleDelete(blog.id)}
                      disabled={deleteMutation.isLoading}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Không có dữ liệu bài viết
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} className="admin-modal" size="xl">
        <ModalHeader toggle={closeModal}>
          <i className={`fas ${editingBlog ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">Tiêu đề</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">URL hình ảnh</Label>
                  <Input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    placeholder="https://example.com/image.jpg"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="admin-form-group">
              <Label className="admin-form-label">Quote/Trích dẫn</Label>
              <Input
                type="textarea"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                className="admin-form-control"
                rows="2"
                placeholder="Câu trích dẫn nổi bật của bài viết..."
              />
            </FormGroup>
            <FormGroup className="admin-form-group">
              <Label className="admin-form-label">Nội dung</Label>
              <Input
                type="textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="admin-form-control"
                rows="10"
                required
                placeholder="Nội dung chi tiết của bài viết..."
              />
            </FormGroup>
            {formData.imageUrl && (
              <FormGroup className="admin-form-group">
                <Label className="admin-form-label">Xem trước hình ảnh</Label>
                <div>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', height: 'auto', borderRadius: '10px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              className="btn-admin btn-admin-primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              <i className={`fas ${editingBlog ? 'fa-save' : 'fa-plus'} me-2`}></i>
              {editingBlog ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button 
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={closeModal}
            >
              <i className="fas fa-times me-2"></i>
              Hủy
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
