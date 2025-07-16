import { Form, Input, Modal, notification } from 'antd';
import { useFormik } from 'formik';
import React, { useContext } from 'react';
import * as yup from 'yup';
import AuthContext from '../../contexts/AuthContext';
import { useAddUser, useGetUsers } from '../../apis/user.api';

const FormRegister = ({ form }) => {
	return (
		<Form layout='vertical'>
			<Form.Item label='Email:'>
				<Input
					placeholder='Nhập email...'
					name='email'
					value={form.values.email}
					onChange={form.handleChange}
				/>
			</Form.Item>
			<Form.Item label='Tên người dùng:'>
				<Input
					placeholder='Nhập tên người dùng...'
					name='username'
					value={form.values.username}
					onChange={form.handleChange}
				/>
			</Form.Item>
			<Form.Item label='Mật khẩu:'>
				<Input
					placeholder='Nhập mật khẩu...'
					name='password'
					value={form.values.password}
					onChange={form.handleChange}
				/>
			</Form.Item>
		</Form>
	);
};

const FormLogin = ({ form }) => {
	return (
		<Form layout='vertical'>
			<Form.Item label='Email:'>
				<Input
					placeholder='Nhập email...'
					name='email'
					value={form.values.email}
					onChange={form.handleChange}
				/>
			</Form.Item>
			<Form.Item label='Mật khẩu:'>
				<Input
					placeholder='Nhập mật khẩu...'
					name='password'
					value={form.values.password}
					onChange={form.handleChange}
				/>
			</Form.Item>
		</Form>
	);
};

const ModalAuthentication = ({ status, open, handleCloseModal }) => {
	const [api, contextHolder] = notification.useNotification();

	const { onChangeUserCurrent } = useContext(AuthContext);

	const title =
		status === 'register' ? 'Đăng ký tài khoản' : 'Đăng nhập tài khoản';
	const okText = status === 'register' ? 'Đăng ký' : 'Đăng nhập';

	const { mutate: register } = useAddUser({
		handleSuccess: () => {
			api.success({
				message: `Đăng ký thành công`,
				placement: 'topRight',
			});
			formRegister.handleReset();
		},
		handleError: (error) => {
			api.error({
				message: `Đăng ký thất bại`,
				description: error,
				placement: 'topRight',
			});
		},
	});

	const { data: users } = useGetUsers();

	const formRegister = useFormik({
		initialValues: {
			email: '',
			username: '',
			password: '',
		},
		// validationSchema: yup.object({
		// 	email: yup.string().required('Email là bắt buộc'),
		// 	username: yup
		// 		.string()
		// 		.required('Tên người dùng là bắt buộc')
		// 		.min(2, 'Tên người dùng không hợp lệ'),
		// 	password: yup
		// 		.string()
		// 		.required('Mật khẩu là bắt buộc')
		// 		.min(6, 'Mật khẩu quá ngắn')
		// 		.max(24, 'Mật khẩu quá dài'),
		// }),
		onSubmit: (values) => {
			register(values);
		},
	});

	const formLogin = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		// validationSchema: yup.object({
		// 	email: yup.string().required('Email là bắt buộc'),
		// 	password: yup
		// 		.string()
		// 		.required('Mật khẩu là bắt buộc')
		// 		.min(6, 'Mật khẩu quá ngắn')
		// 		.max(24, 'Mật khẩu quá dài'),
		// }),
		onSubmit: (values) => {
			let isLoginSuccess = false;
			for (let user of users) {
				if (user.email === values.email && user.password === values.password) {
					api.success({
						message: `Đăng nhập thành công`,
						placement: 'topRight',
					});

					onChangeUserCurrent(user);
					handleCloseModal();

					localStorage.setItem('user', JSON.stringify(user));

					return;
				}
			}

			if (isLoginSuccess === false) {
				api.error({
					message: `Đăng nhập thất bại công`,
					description: 'Vui lòng xem lại email hoặc mật khẩu',
					placement: 'topRight',
				});
			}
		},
	});

	const handleSubmit = () => {
		if (status === 'register') {
			formRegister.handleSubmit();
		} else {
			formLogin.handleSubmit();
		}
	};

	return (
		<Modal
			title={title}
			open={open}
			okText={okText}
			cancelText='Hủy'
			onOk={handleSubmit}
			onCancel={handleCloseModal}
		>
			{contextHolder}
			<div className='form-authentication' style={{ marginTop: '12px' }}>
				{status === 'register' ? (
					<FormRegister form={formRegister} />
				) : (
					<FormLogin form={formLogin} />
				)}
			</div>
		</Modal>
	);
};

export default ModalAuthentication;