import React, { useState, useRef } from 'react';
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
  useGetAllServicesAdmin,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useExportServices,
  useImportServices,
  useDownloadTemplate
} from '../../../apis/admin.api';
import { useUploadImage } from '../../../apis/upload.api';

const ServiceManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    icon: '',
    price: '',
    category: '',
    isActive: true
  });
  const [importFile, setImportFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const fileInputRef = useRef(null);
  const uploadImageMutation = useUploadImage();

  // Queries và Mutations
  const { data: services, isLoading, error, refetch } = useGetAllServicesAdmin();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const exportMutation = useExportServices();
  const importMutation = useImportServices();
  const downloadTemplateMutation = useDownloadTemplate();

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý upload ảnh
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      if (result && result.url) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
        addAlert('Upload ảnh thành công!');
      } else {
        addAlert('Upload ảnh thất bại!', 'error');
      }
    } catch (err) {
      addAlert(err.message || 'Có lỗi khi upload ảnh!', 'error');
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        imageUrl: service.imageUrl || '',
        icon: service.icon || '',
        price: service.price || '',
        category: service.category || '',
        isActive: service.isActive !== undefined ? service.isActive : true
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        icon: '',
        price: '',
        category: '',
        isActive: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      icon: '',
      price: '',
      category: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          serviceData
        });
        addAlert('Cập nhật dịch vụ thành công!');
      } else {
        await createMutation.mutateAsync(serviceData);
        addAlert('Thêm dịch vụ thành công!');
      }
      closeModal();
      refetch();
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra!', 'error');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await deleteMutation.mutateAsync(serviceId);
        addAlert('Xóa dịch vụ thành công!');
        refetch();
      } catch (error) {
        addAlert(error.message || 'Có lỗi xảy ra khi xóa!', 'error');
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
      addAlert('Xuất file Excel thành công!');
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra khi xuất file!', 'error');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync();
      addAlert('Tải template thành công!');
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra khi tải template!', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setImportFile(file);
    } else {
      addAlert('Vui lòng chọn file Excel (.xlsx)!', 'error');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      addAlert('Vui lòng chọn file để import!', 'error');
      return;
    }
    
    try {
      await importMutation.mutateAsync(importFile);
      addAlert('Import dữ liệu thành công!');
      setShowImportModal(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetch();
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra khi import!', 'error');
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge className="badge-admin badge-admin-success">Hoạt động</Badge> :
      <Badge className="badge-admin badge-admin-danger">Tạm dừng</Badge>;
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
                <i className="fas fa-concierge-bell me-3"></i>
                Quản lý dịch vụ
              </h3>
              <p className="admin-subtitle">Quản lý tất cả dịch vụ khách sạn và spa</p>
            </div>
          </Col>
          <Col xs="auto">
            <ButtonGroup>
              <Button 
                className="btn-admin btn-admin-primary"
                onClick={() => openModal()}
              >
                <i className="fas fa-plus me-2"></i>
                Thêm dịch vụ
              </Button>
              <Button 
                className="btn-admin btn-admin-success"
                onClick={handleExport}
                disabled={exportMutation.isLoading}
              >
                <i className="fas fa-file-excel me-2"></i>
                Xuất Excel
              </Button>
              <Button 
                className="btn-admin btn-admin-warning"
                onClick={() => setShowImportModal(true)}
              >
                <i className="fas fa-file-import me-2"></i>
                Nhập Excel
              </Button>
              <Button 
                className="btn-admin btn-admin-info"
                onClick={handleDownloadTemplate}
                disabled={downloadTemplateMutation.isLoading}
              >
                <i className="fas fa-download me-2"></i>
                Tải Template
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md="3">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-concierge-bell"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{services?.length || 0}</h4>
              <p>Tổng dịch vụ</p>
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{services ? services.filter(s => s.isActive).length : 0}</h4>
              <p>Đang hoạt động</p>
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-pause-circle"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{services ? services.filter(s => !s.isActive).length : 0}</h4>
              <p>Tạm dừng</p>
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="admin-stat-content">
              <h4>{services ? new Set(services.map(s => s.category)).size : 0}</h4>
              <p>Danh mục</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Table */}
      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Thông tin dịch vụ</th>
            <th>Giá tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services && services.length > 0 ? (
            services.map(service => (
              <tr key={service.id}>
                <td>
                  <span className="badge badge-admin badge-admin-success">{service.id}</span>
                </td>
                <td>
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl + (service.updatedAt ? `?v=${new Date(service.updatedAt).getTime()}` : '')}
                      alt={service.name}
                      className="service-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="icon-placeholder"
                    style={service.imageUrl ? { display: 'none' } : {}}
                  >
                    <i className={service.icon || 'fas fa-concierge-bell'}></i>
                  </div>
                </td>
                <td>
                  <div className="service-info">
                    <div className="service-name">{service.name}</div>
                    <div className="service-category">{service.category || 'Không có danh mục'}</div>
                    <div className="service-description">
                      {service.description || 'Không có mô tả'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="service-price">{service.price?.toLocaleString('vi-VN')}</div>
                </td>
                <td>{getStatusBadge(service.isActive)}</td>
                <td>
                  <div className="admin-date-created">
                    <i className="fas fa-calendar-plus me-1"></i>
                    {service.createdAt ? new Date(service.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) : 'N/A'}
                  </div>
                  {service.updatedAt && service.updatedAt !== service.createdAt && (
                    <div className="admin-date-updated mt-1">
                      <i className="fas fa-edit me-1"></i>
                      {new Date(service.updatedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <Button 
                      className="btn-action btn-action-view"
                      color="info"
                      tag="a"
                      href={`/services/${service.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Xem chi tiết dịch vụ"
                    >
                      <i className="fas fa-eye me-1"></i>
                      Xem
                    </Button>
                    <Button 
                      className="btn-action btn-action-edit"
                      onClick={() => openModal(service)}
                      title="Chỉnh sửa dịch vụ"
                    >
                      <i className="fas fa-edit me-1"></i>
                      Sửa
                    </Button>
                    <Button 
                      className="btn-action btn-action-delete"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMutation.isLoading}
                      title="Xóa dịch vụ"
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
              <td colSpan="7">
                <div className="admin-empty-state">
                  <i className="fas fa-concierge-bell fa-3x"></i>
                  <h5>Chưa có dịch vụ nào</h5>
                  <p>Bắt đầu bằng cách thêm dịch vụ mới cho khách sạn</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} className="admin-modal" size="lg">
        <ModalHeader toggle={closeModal}>
          <i className={`fas ${editingService ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">Tên dịch vụ</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">Danh mục</Label>
                  <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">Giá ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="admin-form-group">
                  <Label className="admin-form-label">Icon (FontAwesome class)</Label>
                  <Input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    placeholder="fas fa-concierge-bell"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="admin-form-group">
              <Label className="admin-form-label">Mô tả</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="admin-form-control"
                rows="3"
                required
              />
            </FormGroup>
            <FormGroup className="admin-form-group">
              <Label className="admin-form-label">Ảnh dịch vụ</Label>
              <div
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) await handleImageFileChange({ target: { files: [file] } });
                }}
                onDragOver={e => e.preventDefault()}
                style={{
                  border: '2px dashed #aaa',
                  borderRadius: 6,
                  padding: 16,
                  textAlign: 'center',
                  background: '#fafbfc',
                  cursor: 'pointer',
                  marginBottom: 8
                }}
                title="Kéo thả ảnh vào đây hoặc bấm để chọn ảnh"
                onClick={() => document.getElementById('service-image-upload').click()}
              >
                <input
                  id="service-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
                {uploadImageMutation.isLoading ? (
                  <div style={{ color: '#888', fontSize: 13 }}>Đang upload ảnh...</div>
                ) : formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: 160, maxHeight: 100, borderRadius: 4, border: '1px solid #eee', margin: '0 auto' }} />
                ) : (
                  <div style={{ color: '#888' }}>
                    Kéo thả ảnh vào đây hoặc <span style={{ color: '#007bff', textDecoration: 'underline' }}>bấm để chọn ảnh</span>
                  </div>
                )}
              </div>
            </FormGroup>
            <FormGroup check className="admin-form-group">
              <Label check className="admin-form-label">
                <Input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Kích hoạt dịch vụ
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              className="btn-admin btn-admin-primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              <i className={`fas ${editingService ? 'fa-save' : 'fa-plus'} me-2`}></i>
              {editingService ? 'Cập nhật' : 'Thêm mới'}
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

      {/* Import Modal */}
      <Modal isOpen={showImportModal} toggle={() => setShowImportModal(false)} className="admin-modal">
        <ModalHeader toggle={() => setShowImportModal(false)}>
          <i className="fas fa-file-import me-2"></i>
          Nhập dữ liệu từ Excel
        </ModalHeader>
        <ModalBody>
          <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
            <div className="file-upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <div className="file-upload-text">
              {importFile ? importFile.name : 'Nhấp để chọn file Excel'}
            </div>
            <div className="file-upload-subtext">
              Hỗ trợ định dạng .xlsx
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx"
            style={{ display: 'none' }}
          />
        </ModalBody>
        <ModalFooter>
          <Button 
            className="btn-admin btn-admin-primary"
            onClick={handleImport}
            disabled={!importFile || importMutation.isLoading}
          >
            <i className="fas fa-upload me-2"></i>
            Nhập dữ liệu
          </Button>
          <Button 
            className="btn-admin btn-admin-secondary"
            onClick={() => setShowImportModal(false)}
          >
            <i className="fas fa-times me-2"></i>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
