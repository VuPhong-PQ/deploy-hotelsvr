
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userCurrent, setUserCurrent] = useState(() => {
    const userLoggined = JSON.parse(localStorage.getItem('user'));
    return userLoggined || null;
  });

  const login = (user, token) => {
    setUserCurrent(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUserCurrent(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    userCurrent,
    onChangeUserCurrent: setUserCurrent,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
