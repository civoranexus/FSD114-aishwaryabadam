import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');   // Redirect to login after logout
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          EduVillage
        </Link>

        {/* Right side menu */}
        <ul className="navbar-menu">

          <li>
            <Link to="/courses">Courses</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </li>

              {/* User info */}
              <li className="navbar-user">
                <span>{user.name}</span>
                <span className="user-role">({user.role})</span>
              </li>

              {/* Logout button */}
              <li>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
