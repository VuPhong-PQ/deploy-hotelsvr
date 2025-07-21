import { useState } from 'react';
import { Avatar, notification } from 'antd';
import ModalAuthentication from '../ModalAuthentication';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
	const [api, contextHolder] = notification.useNotification();

	const { userCurrent, logout } = useAuth() ?? {};

	const [isOpenModal, setIsOpenModal] = useState(false);
	const [status, setStatus] = useState('register');

	const handleOpenModal = (stt) => {
		setIsOpenModal(true);
		setStatus(stt);
	};

	const handleCloseModal = () => {
		setIsOpenModal(false);
	};

	const handleLogout = () => {
		logout();
		api.info({
			message: `Người dùng đã đăng xuất`,
			placement: 'topRight',
		});
	};

	return (
		<>
			{contextHolder}
			{/* Navbar đã được ẩn để web đẹp hơn */}
			<ModalAuthentication
				open={isOpenModal}
				status={status}
				handleCloseModal={handleCloseModal}
			/>
		</>
	);
};

export default Navbar;