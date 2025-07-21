
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userCurrent, setUserCurrent] = useState(() => {
    const userLoggined = JSON.parse(localStorage.getItem('user'));
    return userLoggined || null;
  });

  const login = (user) => {
    setUserCurrent(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUserCurrent(null);
    localStorage.removeItem('user');
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
