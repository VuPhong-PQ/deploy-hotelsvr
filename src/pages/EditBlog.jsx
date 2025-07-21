import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { useGetBlogById, useUpdateBlog } from '../apis/blog.api';
import ImageUpload from '../components/UI/ImageUpload';
import '../styles/create-blog.css';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userCurrent } = useContext(AuthContext);
  
  const { data: blog, isLoading: blogLoading, error: blogError } = useGetBlogById(id);
  const updateBlogMutation = useUpdateBlog();
  const isLoading = updateBlogMutation.isPending;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageFileName: '',
    category: '',
    tags: ''
  });
  
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('1');

  // Function to render content with links and images for preview
  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (!line.trim()) {
        return <br key={index} />;
      }

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)(\?[^\s]*)?$/i;
      const urls = line.match(urlRegex);
      
      if (urls) {
        let processedLine = line;
        
        urls.forEach(url => {
          if (imageRegex.test(url)) {
            processedLine = processedLine.replace(url, 
              `<div style="text-align: center; margin: 20px 0;">
                <img src="${url}" alt="Hình ảnh đính kèm" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
              </div>`
            );
          } else {
            const domain = url.replace(/^https?:\/\//, '').split('/')[0];
            processedLine = processedLine.replace(url, 
              `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none; font-weight: 500;">
                🔗 ${domain}
              </a>`
            );
          }
        });

        return (
          <div 
            key={index}
            dangerouslySetInnerHTML={{ __html: processedLine }}
            style={{ marginBottom: '12px', lineHeight: '1.8' }}
          />
        );
      }

      return (
        <p key={index} style={{ marginBottom: '12px', lineHeight: '1.8' }}>
          {line}
        </p>
      );
    });
  };

  // Redirect if not logged in
  React.useEffect(() => {
    if (!userCurrent) {
      navigate('/');
    }
  }, [userCurrent, navigate]);

  // Populate form when blog data is loaded
  useEffect(() => {
    if (blog) {
      // Check if current user is the author
      if (blog.authorId !== userCurrent?.id && blog.authorId !== userCurrent?.Id) {
        alert('Bạn không có quyền chỉnh sửa blog này!');
        navigate('/my-blogs');
        return;
      }

      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        imageUrl: blog.imageUrl || '',
        imageFileName: '',
        category: blog.category || '',
        tags: blog.tags || ''
      });
    }
  }, [blog, userCurrent, navigate]);

  const handleImageUploaded = (imageUrl, fileName) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageUrl,
      imageFileName: fileName
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userCurrent) {
      alert('Bạn cần đăng nhập để chỉnh sửa blog');
      return;
    }

    // Validate form
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.content.trim()) newErrors.content = 'Nội dung là bắt buộc';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/800x400/3498db/ffffff?text=Blog+Image',
        category: formData.category,
        tags: formData.tags || '',
        authorId: userCurrent.id || userCurrent.Id
      };

      await updateBlogMutation.mutateAsync({ id, blogData });
      
      alert('Blog đã được cập nhật thành công!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      setErrors({ submit: error.message });
    }
  };

  const handleCancel = () => {
    navigate('/my-blogs');
  };

  // Don't render if not authenticated
  if (!userCurrent) {
    return null;
  }

  if (blogLoading) {
    return (
      <section className="create-blog-section">
        <Container>
          <Row>
            <Col lg="8" md="10" className="mx-auto">
              <Card className="create-blog-card p-4">
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Đang tải...</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (blogError || !blog) {
    return (
      <section className="create-blog-section">
        <Container>
          <Row>
            <Col lg="8" md="10" className="mx-auto">
              <Card className="create-blog-card p-4">
                <Alert color="danger">
                  {blogError ? `Có lỗi xảy ra: ${blogError.message}` : 'Không tìm thấy blog'}
                </Alert>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="create-blog-section">
      <Container>
        <Row>
          <Col lg="8" md="10" className="mx-auto">
            <Card className="create-blog-card p-4">
              <h2 className="text-center mb-4">Chỉnh Sửa Blog</h2>
              
              {errors.submit && (
                <Alert color="danger" className="mb-4">
                  {errors.submit}
                </Alert>
              )}

              {/* Navigation Tabs */}
              <Nav tabs className="mb-4">
                <NavItem>
                  <NavLink
                    className={activeTab === '1' ? 'active' : ''}
                    onClick={() => setActiveTab('1')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="ri-edit-line"></i> Chỉnh sửa
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '2' ? 'active' : ''}
                    onClick={() => setActiveTab('2')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="ri-eye-line"></i> Xem trước
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                {/* Edit Tab */}
                <TabPane tabId="1">
                  <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="title">Tiêu đề *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Nhập tiêu đề blog..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="category">Danh mục</label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="travel">Du lịch</option>
                    <option value="hotel">Khách sạn</option>
                    <option value="food">Ẩm thực</option>
                    <option value="experience">Trải nghiệm</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Hình ảnh blog</label>
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    currentImage={formData.imageUrl}
                    placeholder="Chọn ảnh cho blog..."
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="form-control"
                    placeholder="travel, hotel, vacation..."
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="content">Nội dung blog *</label>
                  <textarea
                    id="content"
                    name="content"
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    rows="10"
                    placeholder="Viết nội dung blog của bạn..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <small className="form-text text-muted">
                    💡 <strong>Mẹo:</strong> Để thêm hình ảnh hoặc links, chỉ cần dán URL vào nội dung:
                    <br />• Hình ảnh: https://example.com/image.jpg
                    <br />• Link: https://example.com/link
                  </small>
                  {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                </div>

                <div className="form-actions d-flex gap-3 justify-content-end">
                  <Button 
                    type="button" 
                    color="secondary" 
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật Blog'}
                  </Button>
                </div>
              </Form>
            </TabPane>

            {/* Preview Tab */}
            <TabPane tabId="2">
              <div className="blog-preview">
                <h2 className="preview-title">{formData.title || 'Tiêu đề blog'}</h2>
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="preview-image w-100 mb-3"
                    style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                <div className="preview-content">
                  {renderContent(formData.content)}
                </div>
              </div>
            </TabPane>
          </TabContent>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EditBlog;
