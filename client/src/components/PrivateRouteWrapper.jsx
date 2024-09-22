import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteWrapper = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRouteWrapper;
