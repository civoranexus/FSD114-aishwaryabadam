import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import CourseList from './components/student/CourseList';
import CourseDetails from './components/student/CourseDetails';
import LearningInterface from './components/student/LearningInterface';
import QuizInterface from './components/student/QuizInterface';

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard';
import CreateCourse from './components/teacher/CreateCourse';
import CourseBuilder from './components/teacher/CourseBuilder';
import CreateQuiz from './components/teacher/CreateQuiz';
import GradeSubmissions from './components/teacher/GradeSubmissions';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDetails />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="student/learn/:courseId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LearningInterface />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quiz/:assessmentId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <QuizInterface />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/courses/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/courses/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CourseBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/courses/:id/quiz/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions/:assessmentId"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <GradeSubmissions />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Page Not Found</p>
          <a href="/" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            Go Home
          </a>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;