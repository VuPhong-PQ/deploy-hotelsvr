import React from "react";
import { Col, Alert } from "reactstrap";
import "../../styles/blog-item.css";
import { Link } from "react-router-dom";
import { useGetBlogs } from "../../apis/blog.api";

const BlogList = () => {
  const { data: blogs = [], isLoading, error } = useGetBlogs();

  if (isLoading) {
    return (
      <Col lg="12" className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </Col>
    );
  }

  if (error) {
    return (
      <Col lg="12">
        <Alert color="danger">
          Có lỗi xảy ra khi tải blogs: {error.message}
        </Alert>
      </Col>
    );
  }

  return (
    <>
      {blogs.map((blog) => (
        <BlogItem item={blog} key={blog.id} />
      ))}
    </>
  );
};

const BlogItem = ({ item }) => {
  const { imageUrl, title, authorName, createdAt, content, id } = item;

  return (
    <Col lg="4" md="6" sm="6" className="mb-5">
      <div className="blog__item">
        <img 
          src={imageUrl || "https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Image"} 
          alt={title} 
          className="w-100"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Image";
          }}
        />
        <div className="blog__info p-3">
          <Link to={`/blogs/${id}`} className="blog__title">
            {title}
          </Link>
          <p className="section__description mt-3">
            {content && content.length > 100
              ? `${content.substr(0, 100)}...`
              : content}
          </p>

          <Link to={`/blogs/${id}`} className="read__more">
            Đọc thêm
          </Link>

          <div className="blog__time pt-3 mt-3 d-flex align-items-center justify-content-between">
            <span className="blog__author">
              <i className="ri-user-line"></i> {authorName || 'Tác giả'}
            </span>

            <div className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center gap-1 section__description">
                <i className="ri-calendar-line"></i> {new Date(createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default BlogList;
