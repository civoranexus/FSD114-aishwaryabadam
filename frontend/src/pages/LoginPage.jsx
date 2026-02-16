import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import LoginForm from '../components/auth/LoginForm';
import './AuthPage.css';

const LoginPage = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;