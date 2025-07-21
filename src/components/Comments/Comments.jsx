import React, { useState, useEffect } from 'react';
import { Card, CardBody, Form, FormGroup, Input, Button } from 'reactstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useGetBlogById } from '../../apis/blog.api';
import { useCreateComment, useDeleteComment } from '../../apis/comment.api';
import '../../styles/comments.css';

const Comments = ({ blogId }) => {
  const { userCurrent } = useAuth();
  const { data: blog } = useGetBlogById(blogId);
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [comments, setComments] = useState([]);
  const [blogInfo, setBlogInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommentsWithPermissions();
  }, [blogId, userCurrent]);

  const fetchCommentsWithPermissions = async () => {
    setIsLoading(true);
    setError(null);
    
    const userId = userCurrent?.id || localStorage.getItem('userId');
    
    if (!userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/blog/${blogId}`);
        const comments = await response.json();
        setComments(comments.map(c => ({ ...c, canDelete: false })));
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/comments/blog/${blogId}/with-permissions/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setComments(data.comments);
      setBlogInfo(data.blogInfo);
    } catch (error) {
      // Fallback to regular endpoint
      try {
        const response = await fetch(`http://localhost:5000/api/comments/blog/${blogId}`);
        const comments = await response.json();
        setComments(comments.map(c => ({ ...c, canDelete: false })));
      } catch (fallbackError) {
        setError(fallbackError);
      }
    }
    
    setIsLoading(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung comment');
      return;
    }

    try {
      const commentData = {
        content: newComment.trim(),
        blogId: parseInt(blogId)
      };

      if (userCurrent?.id) {
        commentData.userId = userCurrent.id;
      } else {
        commentData.guestName = guestName.trim() || 'Khách';
        commentData.guestEmail = guestEmail.trim();
      }

      await createCommentMutation.mutateAsync(commentData);
      await fetchCommentsWithPermissions();
      
      setNewComment('');
      setGuestName('');
      setGuestEmail('');
      setShowForm(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi đăng comment: ' + error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const userId = userCurrent?.id || localStorage.getItem('userId');
    
    if (!userId) {
      alert('Bạn phải đăng nhập để xóa comment');
      return;
    }
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa comment này?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}?userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Xóa comment thành công');
        fetchCommentsWithPermissions();
      } else {
        const error = await response.json();
        alert(`Không thể xóa comment: ${error.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa comment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="comments-section">
        <h4>Bình luận</h4>
        <div className="text-center py-3">
          <div className="spinner-border" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comments-section">
        <h4>Bình luận</h4>
        <div className="alert alert-danger">
          Có lỗi xảy ra khi tải comments: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Bình luận ({comments.length})</h4>
        <Button 
          color="primary" 
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hủy' : 'Viết bình luận'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <Form onSubmit={handleSubmitComment}>
              <FormGroup>
                {!userCurrent && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Input
                        type="text"
                        placeholder="Tên của bạn"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        type="email"
                        placeholder="Email (tùy chọn)"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <Input
                  type="textarea"
                  placeholder={userCurrent ? "Viết bình luận..." : "Viết bình luận (khách)..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  required
                />
              </FormGroup>
              
              <div className="d-flex gap-2">
                <Button 
                  type="submit" 
                  color="primary"
                  disabled={createCommentMutation.isPending}
                >
                  {createCommentMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
                <Button 
                  type="button" 
                  color="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setNewComment('');
                    setGuestName('');
                    setGuestEmail('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty">
            <i className="ri-chat-3-line"></i>
            <p>Chưa có bình luận nào</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="comment-item mb-3">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="comment-header">
                    <h6 className="comment-author mb-1">
                      {comment.authorName || 'Khách'}
                      {comment.isGuest && (
                        <span className="badge bg-secondary ms-2">Khách</span>
                      )}
                    </h6>
                    <p className="comment-meta mb-2 text-muted small">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  
                  {comment.canDelete && (
                    <div className="comment-actions">
                      <Button
                        color="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deleteCommentMutation.isPending}
                        title={comment.deleteReason || "Xóa comment"}
                      >
                        🗑️ Xóa
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="comment-content mt-2">
                  {comment.content}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;



