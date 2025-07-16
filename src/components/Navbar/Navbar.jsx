import { useContext, useState } from 'react';
import { Avatar, notification } from 'antd';
import ModalAuthentication from '../ModalAuthentication';
import AuthContext from '../../contexts/AuthContext';

const Navbar = () => {
	const [api, contextHolder] = notification.useNotification();

	const { userCurrent, onChangeUserCurrent } = useContext(AuthContext) ?? {};

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
		onChangeUserCurrent(null);
		localStorage.removeItem('user');

		api.info({
			message: `Người dùng đã đăng xuất`,
			placement: 'topRight',
		});
	};

	return (
		<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			{contextHolder}
			<div className='container'>
				<a className='navbar-brand' href='#!'>
					User Information
				</a>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon' />
				</button>
				<div className='collapse navbar-collapse' id='navbarSupportedContent'>
					<ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
						{userCurrent === null ? (
							<>
								{/* Chưa đăng nhập */}
								<li className='nav-item'>
									<span
										className='nav-link'
										style={{ cursor: 'pointer' }}
										onClick={() => handleOpenModal('register')}
									>
										Register
									</span>
								</li>
								<li className='nav-item'>
									<span
										className='nav-link'
										style={{ cursor: 'pointer' }}
										onClick={() => handleOpenModal('login')}
									>
										Login
									</span>
								</li>
							</>
						) : (
							<>
								{/* Đã đăng nhập */}
								<li className='nav-item'>
									<span className='nav-link' style={{ cursor: 'pointer' }}>
										Tạo bài viết
									</span>
								</li>
								<Avatar
									style={{
										backgroundColor: 'lightskyblue',
										verticalAlign: 'middle',
									}}
									size='large'
								>
									{userCurrent?.username?.charAt(0)?.toUpperCase()}
								</Avatar>
								<li className='nav-item'>
									<span
										className='nav-link'
										style={{ cursor: 'pointer' }}
										onClick={handleLogout}
									>
										Đăng xuất
									</span>
								</li>
							</>
						)}

						<ModalAuthentication
							open={isOpenModal}
							status={status}
							handleCloseModal={handleCloseModal}
						/>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;