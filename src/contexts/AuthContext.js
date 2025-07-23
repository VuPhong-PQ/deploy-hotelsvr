
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userCurrent, setUserCurrent] = useState(() => {
    const userLoggined = JSON.parse(localStorage.getItem('user'));
    return userLoggined || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = (user, authToken) => {
    setUserCurrent(user);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(user));
    if (authToken) {
      localStorage.setItem('token', authToken);
    }
  };

  const logout = () => {
    setUserCurrent(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    userCurrent,
    token,
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
