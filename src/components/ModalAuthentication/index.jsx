import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Tabs } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginUser, useRegisterUser } from '../../apis/user.api';

const { TabPane } = Tabs;

const ModalAuthentication = ({ open, handleCloseModal, status }) => {
  const [activeTab, setActiveTab] = useState(status);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const { login } = useAuth();

  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const handleLogin = async (values) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      login(response.user, response.token);
      message.success(response.message || 'Đăng nhập thành công!');
      loginForm.resetFields();
      handleCloseModal();
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại!');
    }
  };

  const handleRegister = async (values) => {
    try {
      const response = await registerMutation.mutateAsync(values);
      message.success(response.message || 'Đăng ký thành công!');
      registerForm.resetFields();
      setActiveTab('login');
    } catch (error) {
      message.error(error.message || 'Đăng ký thất bại!');
    }
  };

  const handleCancel = () => {
    loginForm.resetFields();
    registerForm.resetFields();
    handleCloseModal();
  };

  React.useEffect(() => {
    setActiveTab(status);
  }, [status]);

  return (
    <Modal
      title="Xác thực người dùng"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        centered
      >
        <TabPane tab="Đăng nhập" key="login">
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={handleLogin}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loginMutation.isPending}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Đăng ký" key="register">
          <Form
            form={registerForm}
            layout="vertical"
            onFinish={handleRegister}
          >
            <Form.Item
              label="Tên"
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>

            <Form.Item
              label="Họ"
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
              <Input placeholder="Nhập họ của bạn" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
            >
              <Input placeholder="Nhập số điện thoại (tùy chọn)" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={registerMutation.isPending}
                block
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ModalAuthentication;