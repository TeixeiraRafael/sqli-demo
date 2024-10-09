import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DetailedExpenses from './pages/DetailedExpenses';
import UploadExpenses from './pages/UploadExpenses';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/detailed-view" element={<DetailedExpenses />} />
      <Route path="/upload-view" element={<UploadExpenses />} />

      {isAuthenticated && <Route path="/login" element={<Navigate to="/home" />} />}
      {isAuthenticated && <Route path="/register" element={<Navigate to="/home" />} />}
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
