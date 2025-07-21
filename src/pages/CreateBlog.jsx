import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateBlog } from '../apis/blog.api';
import AuthContext from '../contexts/AuthContext';
import ImageUpload from '../components/UI/ImageUpload';
import '../styles/create-blog.css';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { userCurrent } = useContext(AuthContext);
  const createBlogMutation = useCreateBlog();
  const isLoading = createBlogMutation.isPending;
  
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
    if (!content) return <p className="text-muted">Nội dung blog sẽ hiển thị ở đây...</p>;

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
      alert('Bạn cần đăng nhập để tạo blog');
      return;
    }

    // Validate form
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.content.trim()) newErrors.content = 'Nội dung là bắt buộc';
    if (!formData.category) newErrors.category = 'Danh mục là bắt buộc';

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

      await createBlogMutation.mutateAsync(blogData);
      
      alert('Blog đã được tạo thành công!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      setErrors({ submit: error.message });
    }
  };

  const handleCancel = () => {
    navigate('/my-blogs');
  };

  if (!userCurrent) {
    return (
      <section className="create-blog-section">
        <Container>
          <Row>
            <Col lg="8" md="10" className="mx-auto">
              <Card className="create-blog-card p-4">
                <Alert color="warning">
                  Bạn cần đăng nhập để tạo blog mới.
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
              <h2 className="text-center mb-4">Tạo Blog Mới</h2>
              
              {errors.submit && (
                <Alert color="danger" className="mb-4">
                  {errors.submit}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="title">Tiêu đề blog *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Nhập tiêu đề blog..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
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
                    className="form-control"
                    rows="10"
                    placeholder="Viết nội dung blog của bạn..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
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
                    {isLoading ? 'Đang tạo...' : 'Tạo Blog'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CreateBlog;
