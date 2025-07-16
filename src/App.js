import Layout from './components/Layout/Layout';
import { useState } from 'react';
import AuthContext from './contexts/AuthContext';

function App() {
	const [userCurrent, setUserCurrent] = useState(() => {
		const userLoggined = JSON.parse(localStorage.getItem('user'));
		if (userLoggined) {
			return userLoggined;
		}

		return null;
	});

	return (
		<AuthContext.Provider
			value={{
				userCurrent: userCurrent,
				onChangeUserCurrent: setUserCurrent,
			}}
		>
			<Layout />
		</AuthContext.Provider>
	);
}

export default App;
