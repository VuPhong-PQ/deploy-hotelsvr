import React, { useState } from 'react';
import { 
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
  Badge
} from 'reactstrap';
import { 
  useGetAllUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useExportUsers,
  useDownloadUserTemplate
} from '../../../apis/admin.api';

const UserManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    password: ''
  });
  const [alerts, setAlerts] = useState([]);

  // Queries và Mutations
  const { data: users = [], isLoading, error, refetch } = useGetAllUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const exportMutation = useExportUsers();
  const downloadTemplateMutation = useDownloadUserTemplate();

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'User',
        password: ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'User',
        password: ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({
          id: editingUser.id,
          ...formData
        });
        addAlert('Cập nhật người dùng thành công!');
      } else {
        await createMutation.mutateAsync(formData);
        addAlert('Thêm người dùng thành công!');
      }
      closeModal();
      refetch();
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra!', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteMutation.mutateAsync(id);
        addAlert('Xóa người dùng thành công!');
        refetch();
      } catch (error) {
        addAlert(error.message || 'Có lỗi xảy ra khi xóa!', 'error');
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
      addAlert('Xuất dữ liệu thành công!');
    } catch (error) {
      addAlert(error.message || 'Có lỗi xảy ra khi xuất dữ liệu!', 'error');
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

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <Badge color="danger" className="badge-soft">Admin</Badge>;
      case 'User':
        return <Badge color="info" className="badge-soft">User</Badge>;
      default:
        return <Badge color="warning" className="badge-soft">{role}</Badge>;
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
    <div className="user-management">
      {/* Alerts */}
      {alerts.map(alert => (
        <Alert 
          key={alert.id} 
          color={alert.type === 'error' ? 'danger' : 'success'}
          className={`alert-admin ${alert.type === 'error' ? 'alert-admin-error' : ''}`}
        >
          {alert.message}
        </Alert>
      ))}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-users me-2"></i>
          Quản lý người dùng
        </h3>
        <div className="header-actions">
          <Button 
            className="btn-header-action btn-success"
            onClick={() => openModal()}
          >
            <i className="fas fa-plus me-1"></i>
            <span>Thêm người dùng</span>
          </Button>
          <Button 
            className="btn-header-action btn-info"
            onClick={handleDownloadTemplate}
            disabled={downloadTemplateMutation.isPending}
          >
            <i className="fas fa-download me-1"></i>
            <span>Template</span>
          </Button>
          <Button 
            className="btn-header-action btn-primary"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <i className="fas fa-file-excel me-1"></i>
            <span>Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm me-2">
                      <div className="avatar-title bg-primary text-white rounded-circle">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="fw-medium">{user.firstName} {user.lastName}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className="action-buttons">
                    <Button
                      className="btn-action btn-edit"
                      onClick={() => openModal(user)}
                      title="Chỉnh sửa"
                    >
                      <i className="fas fa-edit me-1"></i>
                      <span>Sửa</span>
                    </Button>
                    <Button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'Admin'}
                      title="Xóa"
                    >
                      <i className="fas fa-trash me-1"></i>
                      <span>Xóa</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} size="lg">
        <ModalHeader toggle={closeModal}>
          <i className={`fas ${editingUser ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="firstName">Họ *</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="lastName">Tên *</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </FormGroup>
              </div>
            </div>
            
            <FormGroup>
              <Label for="email">Email *</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="phone">Số điện thoại</Label>
              <Input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </FormGroup>

            {!editingUser && (
              <FormGroup>
                <Label for="password">Mật khẩu *</Label>
                <Input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label for="role">Vai trò</Label>
              <Input
                type="select"
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              className="btn-action btn-edit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1"></i>
                  <span>{editingUser ? 'Cập nhật' : 'Tạo mới'}</span>
                </>
              )}
            </Button>
            <Button 
              type="button" 
              color="secondary"
              onClick={closeModal}
            >
              <span>Hủy</span>
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
