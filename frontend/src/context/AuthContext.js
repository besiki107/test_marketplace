import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useLocalStorage('adminToken', null);
  const [isAdmin, setIsAdmin] = useState(!!adminToken);

  useEffect(() => {
    setIsAdmin(!!adminToken);
  }, [adminToken]);

  const login = (username, password) => {
    const adminUser = process.env.REACT_APP_ADMIN_USER || 'admin';
    const adminPass = process.env.REACT_APP_ADMIN_PASS || 'admin123';

    if (username === adminUser && password === adminPass) {
      const token = btoa(`${username}:${password}:${Date.now()}`);
      setAdminToken(token);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};