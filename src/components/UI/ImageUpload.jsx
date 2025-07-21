import React, { useRef, useState } from 'react';
import { Button, Progress, Alert } from 'reactstrap';
import { useUploadImage } from '../../apis/upload.api';

const ImageUpload = ({ onImageUploaded, currentImage, placeholder = "Chọn ảnh..." }) => {
  const fileInputRef = useRef(null);
  const uploadMutation = useUploadImage();
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, BMP, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File quá lớn. Kích thước tối đa là 5MB');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadMutation.mutateAsync(file);
      onImageUploaded(result.fullUrl, result.fileName);
    } catch (error) {
      setError(error.message);
      setPreview(currentImage); // Reset preview on error
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {uploadMutation.isPending && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small>Đang upload...</small>
            <small>Vui lòng đợi</small>
          </div>
          <Progress animated value={100} color="primary" />
        </div>
      )}

      <div className="image-upload-area">
        {preview ? (
          <div className="image-preview">
            <img 
              src={preview} 
              alt="Preview" 
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
            <div className="image-overlay">
              <Button 
                color="primary" 
                size="sm" 
                className="me-2"
                onClick={handleFileSelect}
                disabled={uploadMutation.isPending}
              >
                <i className="ri-image-line me-1"></i>
                Thay đổi
              </Button>
              <Button 
                color="danger" 
                size="sm"
                onClick={handleRemoveImage}
                disabled={uploadMutation.isPending}
              >
                <i className="ri-delete-bin-line me-1"></i>
                Xóa
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder"
            onClick={handleFileSelect}
            style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '3rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.backgroundColor = '#e9f4ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
            <i className="ri-image-add-line" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            <p className="mt-2 mb-0 text-muted">{placeholder}</p>
            <small className="text-muted">Kéo thả hoặc click để chọn ảnh</small>
          </div>
        )}
      </div>

      <style jsx>{`
        .image-upload-container {
          position: relative;
        }

        .image-preview {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .image-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 0.5rem;
        }

        .upload-placeholder:hover {
          border-color: #007bff !important;
          background-color: #e9f4ff !important;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
