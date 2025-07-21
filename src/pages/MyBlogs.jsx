import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { useGetBlogsByAuthor, useDeleteBlog } from '../apis/blog.api';
import '../styles/blog-item.css';

const MyBlogs = () => {
  const { userCurrent } = useContext(AuthContext);
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blog: null });

  // Always call hooks first
  const { data: myBlogs = [], isLoading, error } = useGetBlogsByAuthor(userCurrent?.id || userCurrent?.Id);
  const deleteBlogs = useDeleteBlog();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!userCurrent) {
      navigate('/');
    }
  }, [userCurrent, navigate]);

  // Don't render if not authenticated
  if (!userCurrent) {
    return null;
  }

  const handleDelete = (blog) => {
    setDeleteModal({ isOpen: true, blog });
  };

  const confirmDelete = async () => {
    if (deleteModal.blog) {
      try {
        await deleteBlogs.mutateAsync(deleteModal.blog.id);
        setDeleteModal({ isOpen: false, blog: null });
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, blog: null });
  };

  if (isLoading) {
    return (
      <section className="py-5">
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5">
        <Container>
          <Alert color="danger">
            Có lỗi xảy ra khi tải blogs: {error.message}
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section className="my-blogs-section">
      <Container>
        <Row className="mb-4">
          <Col lg="12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Blog Của Tôi</h2>
              <Link to="/create-blog">
                <Button color="primary">
                  <i className="ri-add-line"></i> Tạo Blog Mới
                </Button>
              </Link>
            </div>
          </Col>
        </Row>

        {myBlogs.length === 0 ? (
          <Row>
            <Col lg="12" className="text-center">
              <div className="empty-state py-5">
                <h4>Bạn chưa có blog nào</h4>
                <p className="text-muted">Hãy tạo blog đầu tiên của bạn!</p>
                <Link to="/create-blog">
                  <Button color="primary">Tạo Blog Ngay</Button>
                </Link>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            {myBlogs.map(blog => (
              <Col lg="6" md="6" sm="12" className="mb-4" key={blog.id}>
                <Card className="blog-item h-100">
                  <div className="blog-img">
                    <img 
                      src={blog.imageUrl || "https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Image"} 
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Image";
                      }}
                    />
                    <div className="blog-status">
                      <span className="badge bg-success">
                        Đã xuất bản
                      </span>
                    </div>
                  </div>

                  <CardBody>
                    <div className="blog-meta mb-2">
                      <span className="blog-category">{blog.category || 'Chung'}</span>
                      <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <h5 className="blog-title">{blog.title}</h5>
                    <p className="blog-content">
                      {blog.content && blog.content.length > 120 ? `${blog.content.substring(0, 120)}...` : blog.content}
                    </p>

                    <div className="blog-actions d-flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        color="primary" 
                        outline
                        onClick={() => navigate(`/edit-blog/${blog.id}`)}
                      >
                        <i className="ri-edit-line"></i> Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        color="danger" 
                        outline
                        onClick={() => handleDelete(blog)}
                        disabled={deleteBlogs.isPending}
                      >
                        <i className="ri-delete-bin-line"></i> Xóa
                      </Button>
                      <Link to={`/blogs/${blog.id}`}>
                        <Button size="sm" color="info" outline>
                          <i className="ri-eye-line"></i> Xem
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} toggle={cancelDelete}>
        <ModalHeader toggle={cancelDelete}>Xác nhận xóa</ModalHeader>
        <ModalBody>
          Bạn có chắc chắn muốn xóa blog "{deleteModal.blog?.title}"? Hành động này không thể hoàn tác.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelDelete}>
            Hủy
          </Button>
          <Button 
            color="danger" 
            onClick={confirmDelete}
            disabled={deleteBlogs.isPending}
          >
            {deleteBlogs.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  );
};

export default MyBlogs;
