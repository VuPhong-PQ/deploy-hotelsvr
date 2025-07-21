import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner
} from 'reactstrap';
import { 
  useGetAllUsers,
  useUpdateUserRole,
  useDeleteUser
} from '../../apis/admin.api';
import { useAuth } from '../../contexts/AuthContext';

const UserManager = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [alerts, setAlerts] = useState([]);
  const { userCurrent } = useAuth();

  // Queries và Mutations
  const { data: users, isLoading, error, refetch } = useGetAllUsers();
  const updateRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  // Alert helper
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'User');
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateRoleMutation.mutateAsync({
        userId: selectedUser.id,
        role: newRole
      });
      addAlert('success', '✅ Cập nhật quyền thành công!');
      setShowRoleModal(false);
      refetch();
    } catch (error) {
      addAlert('error', `❌ ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        addAlert('success', '✅ Xóa người dùng thành công!');
        refetch();
      } catch (error) {
        addAlert('error', `❌ ${error.message}`);
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <Badge color="danger">Admin</Badge>;
      case 'User':
        return <Badge color="primary">User</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h4>👥 Quản Lý Người Dùng</h4>
        <div className="services-actions">
          <Button 
            className="btn-admin btn-admin-primary"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <i className="ri-refresh-line"></i>
            Làm Mới
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="services-table">
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Người Dùng</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>
                    <code>#{user.id}</code>
                  </td>
                  <td>
                    <h6 className="service-title">{user.name || user.username || 'N/A'}</h6>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                      {user.email}
                    </a>
                  </td>
                  <td>
                    {getRoleBadge(user.role)}
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(user.createdAt)}
                    </small>
                  </td>
                  <td>
                    <div className="service-actions">
                      <Button
                        className="btn-sm-admin btn-admin-warning"
                        onClick={() => openRoleModal(user)}
                        disabled={user.role === 'Admin' && user.id === userCurrent?.id}
                        title={user.role === 'Admin' && user.id === userCurrent?.id ? 'Không thể sửa quyền của chính mình' : 'Sửa quyền'}
                      >
                        <i className="ri-user-settings-line"></i>
                        Quyền
                      </Button>
                      <Button
                        className="btn-sm-admin btn-admin-danger"
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        disabled={deleteUserMutation.isLoading || (user.role === 'Admin' && user.id === userCurrent?.id)}
                        title={user.role === 'Admin' && user.id === userCurrent?.id ? 'Không thể xóa chính mình' : 'Xóa người dùng'}
                      >
                        {deleteUserMutation.isLoading ? (
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
                    <i className="ri-user-line" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <p className="text-muted mt-2">Không có người dùng nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Statistics */}
      {users && users.length > 0 && (
        <Row className="mt-4">
          <Col md={4}>
            <div className="stat-card">
              <div className="stat-icon users">
                <i className="ri-user-line"></i>
              </div>
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Tổng Người Dùng</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#e74c3c' }}>
                <i className="ri-admin-line"></i>
              </div>
              <div className="stat-number">
                {users.filter(u => u.role === 'Admin').length}
              </div>
              <div className="stat-label">Quản Trị Viên</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#3498db' }}>
                <i className="ri-user-3-line"></i>
              </div>
              <div className="stat-number">
                {users.filter(u => u.role === 'User' || !u.role).length}
              </div>
              <div className="stat-label">Người Dùng Thường</div>
            </div>
          </Col>
        </Row>
      )}

      {/* Role Update Modal */}
      <Modal 
        isOpen={showRoleModal} 
        toggle={() => setShowRoleModal(false)}
        className="modal-admin"
      >
        <ModalHeader toggle={() => setShowRoleModal(false)}>
          🔐 Cập Nhật Quyền Người Dùng
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div>
              <Alert color="info" className="alert-admin alert-admin-info">
                <strong>Người dùng:</strong> {selectedUser.name || selectedUser.email}<br />
                <strong>Email:</strong> {selectedUser.email}<br />
                <strong>Quyền hiện tại:</strong> {getRoleBadge(selectedUser.role)}
              </Alert>
              
              <FormGroup>
                <Label className="form-label-admin">Chọn quyền mới:</Label>
                <Input
                  type="select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-control-admin"
                >
                  <option value="User">User - Người dùng thường</option>
                  <option value="Admin">Admin - Quản trị viên</option>
                </Input>
              </FormGroup>
              
              <Alert color="warning" className="alert-admin alert-admin-warning">
                <h6 className="mb-2">⚠️ Lưu ý:</h6>
                <ul className="mb-0 small">
                  <li><strong>Admin:</strong> Có quyền truy cập tất cả tính năng quản trị</li>
                  <li><strong>User:</strong> Chỉ có quyền sử dụng các tính năng cơ bản</li>
                  <li>Thay đổi quyền sẽ có hiệu lực ngay lập tức</li>
                </ul>
              </Alert>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            className="btn-admin btn-admin-warning"
            onClick={handleUpdateRole}
            disabled={updateRoleMutation.isLoading || newRole === selectedUser?.role}
          >
            {updateRoleMutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <i className="ri-save-line"></i>
            )}
            Cập Nhật Quyền
          </Button>
          <Button 
            className="btn-admin btn-admin-secondary"
            onClick={() => setShowRoleModal(false)}
          >
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserManager;
