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
  Spinner,
  Badge
} from 'reactstrap';
import { 
  useGetAllServicesAdmin,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useExportServices,
  useImportServices,
  useDownloadTemplate
} from '../../apis/admin.api';

const ServicesManager = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    featured: false
  });
  const [importFile, setImportFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const fileInputRef = useRef(null);

  // Queries và Mutations
  const { data: services, isLoading, error, refetch } = useGetAllServicesAdmin();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const exportMutation = useExportServices();
  const importMutation = useImportServices();
  const downloadTemplateMutation = useDownloadTemplate();

  // Alert helper
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      image: '',
      featured: false
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      image: service.image || '',
      featured: service.featured || false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };

      if (editingService) {
        await updateMutation.mutateAsync({ 
          id: editingService.id, 
          serviceData 
        });
        addAlert('success', '✅ Cập nhật dịch vụ thành công!');
      } else {
        await createMutation.mutateAsync(serviceData);
        addAlert('success', '✅ Tạo dịch vụ mới thành công!');
      }
      
      setModalOpen(false);
      refetch();
    } catch (error) {
      addAlert('error', `❌ ${error.message}`);
    }
  };

  const handleDelete = async (serviceId, serviceName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${serviceName}"?`)) {
      try {
        await deleteMutation.mutateAsync(serviceId);
        addAlert('success', '✅ Xóa dịch vụ thành công!');
        refetch();
      } catch (error) {
        addAlert('error', `❌ ${error.message}`);
      }
    }
  };

  // Excel handlers
  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
      addAlert('success', '📥 Xuất Excel thành công!');
    } catch (error) {
      addAlert('error', `❌ ${error.message}`);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync();
      addAlert('success', '📥 Tải template thành công!');
    } catch (error) {
      addAlert('error', `❌ ${error.message}`);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setImportFile(file);
      } else {
        addAlert('error', '❌ Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        e.target.value = '';
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      addAlert('error', '❌ Vui lòng chọn file để import');
      return;
    }

    try {
      const result = await importMutation.mutateAsync(importFile);
      addAlert('success', `✅ Import thành công ${result.importedCount} dịch vụ!`);
      setShowImportModal(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetch();
    } catch (error) {
      addAlert('error', `❌ ${error.message}`);
    }
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
          color={alert.type === 'success' ? 'success' : 'danger'}
          className={`alert-admin alert-admin-${alert.type === 'success' ? 'success' : 'error'}`}
        >
          {alert.message}
        </Alert>
      ))}

      {/* Header */}
      <div className="services-header">
        <h4>🛎️ Quản Lý Dịch Vụ</h4>
        <div className="services-actions">
          <Button 
            className="btn-admin btn-admin-primary"
            onClick={openCreateModal}
          >
            <i className="ri-add-line"></i>
            Thêm Dịch Vụ
          </Button>
          <Button 
            className="btn-admin btn-admin-success"
            onClick={handleExport}
            disabled={exportMutation.isLoading}
          >
            {exportMutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <i className="ri-file-excel-line"></i>
            )}
            Xuất Excel
          </Button>
          <Button 
            className="btn-admin btn-admin-warning"
            onClick={() => setShowImportModal(true)}
          >
            <i className="ri-upload-line"></i>
            Nhập Excel
          </Button>
          <Button 
            className="btn-admin btn-admin-secondary"
            onClick={handleDownloadTemplate}
            disabled={downloadTemplateMutation.isLoading}
          >
            {downloadTemplateMutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <i className="ri-download-line"></i>
            )}
            Tải Template
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="services-table">
        <Table responsive>
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tên Dịch Vụ</th>
              <th>Mô Tả</th>
              <th>Giá</th>
              <th>Nổi Bật</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {services && services.length > 0 ? (
              services.map(service => (
                <tr key={service.id}>
                  <td>
                    <img 
                      src={service.image || 'https://via.placeholder.com/60x60?text=No+Image'} 
                      alt={service.title}
                      className="service-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                  </td>
                  <td>
                    <h6 className="service-title">{service.title}</h6>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      {service.description?.length > 100 
                        ? `${service.description.substring(0, 100)}...`
                        : service.description
                      }
                    </div>
                  </td>
                  <td>
                    <span className="service-price">
                      ${service.price?.toLocaleString() || '0'}
                    </span>
                  </td>
                  <td>
                    {service.featured ? (
                      <Badge color="success">Nổi bật</Badge>
                    ) : (
                      <Badge color="secondary">Thường</Badge>
                    )}
                  </td>
                  <td>
                    <div className="service-actions">
                      <Button
                        className="btn-sm-admin btn-admin-primary"
                        onClick={() => openEditModal(service)}
                      >
                        <i className="ri-edit-line"></i>
                        Sửa
                      </Button>
                      <Button
                        className="btn-sm-admin btn-admin-danger"
                        onClick={() => handleDelete(service.id, service.title)}
                        disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <i className="ri-delete-bin-line"></i>
                        )}
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  <div className="py-4">
                    <i className="ri-inbox-line" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <p className="text-muted mt-2">Chưa có dịch vụ nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={modalOpen} 
        toggle={() => setModalOpen(false)}
        className="modal-admin"
        size="lg"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editingService ? '✏️ Chỉnh Sửa Dịch Vụ' : '➕ Thêm Dịch Vụ Mới'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup className="form-group-admin">
                  <Label className="form-label-admin">Tên Dịch Vụ *</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control-admin"
                    placeholder="Nhập tên dịch vụ..."
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="form-group-admin">
                  <Label className="form-label-admin">Giá ($) *</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-control-admin"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <FormGroup className="form-group-admin">
              <Label className="form-label-admin">URL Hình Ảnh</Label>
              <Input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="form-control-admin"
                placeholder="https://example.com/image.jpg"
              />
            </FormGroup>
            
            <FormGroup className="form-group-admin">
              <Label className="form-label-admin">Mô Tả</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control-admin textarea-admin"
                placeholder="Nhập mô tả dịch vụ..."
                rows={4}
              />
            </FormGroup>
            
            <FormGroup check className="form-group-admin">
              <Input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                id="featured-checkbox"
              />
              <Label check for="featured-checkbox" className="form-label-admin">
                Đặt làm dịch vụ nổi bật
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              className="btn-admin btn-admin-primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {(createMutation.isLoading || updateMutation.isLoading) ? (
                <Spinner size="sm" />
              ) : (
                <i className="ri-save-line"></i>
              )}
              {editingService ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
            <Button 
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal 
        isOpen={showImportModal} 
        toggle={() => setShowImportModal(false)}
        className="modal-admin"
      >
        <ModalHeader toggle={() => setShowImportModal(false)}>
          📤 Nhập Dữ Liệu Từ Excel
        </ModalHeader>
        <ModalBody>
          <div className="file-upload-area">
            <i className="ri-file-excel-line file-upload-icon"></i>
            <div className="file-upload-text">
              Chọn file Excel để nhập dữ liệu
            </div>
            <div className="file-upload-hint">
              Chỉ hỗ trợ file .xlsx và .xls
            </div>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="mt-3"
              innerRef={fileInputRef}
            />
          </div>
          
          {importFile && (
            <Alert color="info" className="alert-admin alert-admin-info mt-3">
              <i className="ri-file-line me-2"></i>
              Đã chọn: <strong>{importFile.name}</strong>
            </Alert>
          )}
          
          <Alert color="warning" className="alert-admin alert-admin-warning mt-3">
            <h6 className="mb-2">⚠️ Lưu ý:</h6>
            <ul className="mb-0 small">
              <li>File Excel phải có định dạng đúng template</li>
              <li>Dữ liệu sẽ được thêm vào, không ghi đè</li>
              <li>Hãy tải template mẫu nếu chưa có</li>
            </ul>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button 
            className="btn-admin btn-admin-success"
            onClick={handleImport}
            disabled={!importFile || importMutation.isLoading}
          >
            {importMutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <i className="ri-upload-line"></i>
            )}
            Nhập Dữ Liệu
          </Button>
          <Button 
            className="btn-admin btn-admin-secondary"
            onClick={() => setShowImportModal(false)}
          >
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ServicesManager;
