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

      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <h3>
            <i className="fas fa-concierge-bell me-2"></i>
            Quản lý dịch vụ
          </h3>
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

      {/* Table */}
      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên dịch vụ</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services && services.length > 0 ? (
            services.map(service => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <i className={`${service.icon || 'fas fa-concierge-bell'} me-2`}></i>
                    {service.name}
                  </div>
                </td>
                <td>{service.category}</td>
                <td>${service.price}</td>
                <td>{getStatusBadge(service.isActive)}</td>
                <td>
                  {service.createdAt ? new Date(service.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td>
                  <ButtonGroup size="sm">
                    <Button 
                      className="btn-admin btn-admin-warning"
                      onClick={() => openModal(service)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      className="btn-admin btn-admin-danger"
                      onClick={() => handleDelete(service.id)}
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
                Không có dữ liệu dịch vụ
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
