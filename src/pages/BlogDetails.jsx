import React, { useEffect, useCallback } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { useParams } from "react-router-dom";
import { useGetBlogById } from "../apis/blog.api";
import Helmet from "../components/Helmet/Helmet";
import Comments from "../components/Comments/Comments";
import "../styles/blog-details.css";

const BlogDetails = () => {
  const { id } = useParams();
  const { data: blog, isLoading, error } = useGetBlogById(id);

  // Memoize renderContent function
  const renderContent = useCallback((content) => {
    if (!content) return null;

    // Split content by lines to handle each line separately
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Skip empty lines
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Check if line contains URL pattern
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)(\?[^\s]*)?$/i;
      
      // Find all URLs in the line
      const urls = line.match(urlRegex);
      
      if (urls) {
        let processedLine = line;
        
        urls.forEach(url => {
          // BỎ QUA TẤT CẢ PLACEHOLDER URLs
          if (url.includes('via.placeholder.com') || 
              url.includes('placeholder') || 
              url.includes('picsum.photos') ||
              url.includes('lorempixel.com')) {
            // Thay thế bằng placeholder text thay vì URL
            processedLine = processedLine.replace(url, '[Hình ảnh demo đã bị loại bỏ]');
            return;
          }
          
          if (imageRegex.test(url)) {
            // Replace image URLs with img tags
            processedLine = processedLine.replace(url, 
              `<div style="text-align: center; margin: 20px 0;">
                <img src="${url}" alt="Hình ảnh đính kèm" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;" onclick="window.open('${url}', '_blank')" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div style="display:none; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #6c757d;">❌ Không thể tải ảnh</div>
                <p style="font-style: italic; color: #666; margin-top: 8px; font-size: 0.9em;">Nhấn để xem ảnh gốc</p>
              </div>`
            );
          } else {
            // Replace regular URLs with clickable links
            const domain = url.replace(/^https?:\/\//, '').split('/')[0];
            processedLine = processedLine.replace(url, 
              `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none; font-weight: 500; border-bottom: 1px solid transparent; transition: all 0.3s ease;" onmouseover="this.style.borderBottom='1px solid #007bff'" onmouseout="this.style.borderBottom='1px solid transparent'">
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

      // Regular text line
      return (
        <p key={index} style={{ marginBottom: '12px', lineHeight: '1.8' }}>
          {line}
        </p>
      );
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blog]);

  if (isLoading) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Alert color="danger">
                Có lỗi xảy ra khi tải blog: {error.message}
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (!blog) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Alert color="warning">
                Không tìm thấy blog
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <Helmet title={blog.title}>
      <section>
        <Container>
          <Row>
            <Col lg="8" md="8">
              <div className="blog__details">
                {blog.imageUrl && !blog.imageUrl.includes('via.placeholder.com') && (
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-100"
                    style={{ borderRadius: '8px', marginBottom: '20px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h2 className="section__title mt-4">{blog.title}</h2>

                <div className="blog__publisher d-flex align-items-center gap-4 mb-4">
                  <span className="blog__author">
                    <i className="ri-user-line"></i> {blog.author?.name || blog.authorName || 'Tác giả'}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i className="ri-calendar-line"></i> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="blog__content section__description">
                  {renderContent(blog.content)}
                </div>
                
                {blog.quote && (
                  <h6 className="ps-5 fw-normal">
                    <blockquote className="fs-4">{blog.quote}</blockquote>
                  </h6>
                )}
              </div>

              {/* =============== Comments Section ============ */}
              <Comments blogId={id} />
            </Col>

            {/* ========== SIDEBAR - Điều chỉnh cho cân đối ========== */}
            <Col lg="4" md="4">
              <div className="sidebar">
                {/* Blog Stats */}
                <div className="blog__stats mb-4">
                  <div className="stats__card p-3 bg-light rounded">
                    <h6 className="fw-bold text-center mb-3">Blog Information</h6>
                    <div className="stats__item d-flex justify-content-between mb-2">
                      <span><i className="ri-calendar-line"></i> Published:</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US')}</span>
                    </div>
                    <div className="stats__item d-flex justify-content-between mb-2">
                      <span><i className="ri-user-line"></i> Author:</span>
                      <span>{blog.author?.name || blog.authorName || 'Unknown'}</span>
                    </div>
                    <div className="stats__item d-flex justify-content-between">
                      <span><i className="ri-time-line"></i> Reading time:</span>
                      <span>{Math.ceil((blog.content?.length || 0) / 200)} min</span>
                    </div>
                  </div>
                </div>

                {/* Share Section */}
                <div className="blog__share mb-4">
                  <div className="share__card p-3 bg-light rounded">
                    <h6 className="fw-bold text-center mb-3">Share this post</h6>
                    <div className="share__buttons d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const url = window.location.href;
                          const text = `Check out: ${blog.title}`;
                          if (navigator.share) {
                            navigator.share({ title: blog.title, text, url });
                          } else {
                            navigator.clipboard.writeText(`${text} - ${url}`);
                            alert('Link copied to clipboard!');
                          }
                        }}
                      >
                        <i className="ri-share-line"></i> Share
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied!');
                        }}
                      >
                        <i className="ri-file-copy-line"></i> Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back to Blogs */}
                <div className="blog__navigation">
                  <div className="navigation__card p-3 bg-light rounded">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={() => window.history.back()}
                    >
                      <i className="ri-arrow-left-line"></i> Back to Previous Page
                    </button>
                  </div>
                </div>

                {/* Sticky spacer để đẩy content xuống */}
                <div className="sidebar__spacer" style={{ height: '100px' }}></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default BlogDetails;
