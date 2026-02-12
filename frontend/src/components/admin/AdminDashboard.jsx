import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCourses } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeTeachers: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesData = await getCourses({});
      setRecentCourses(coursesData.courses?.slice(0, 5) || []);
      
      // Mock stats - Replace with actual API calls
      setStats({
        totalUsers: 1250,
        totalCourses: coursesData.courses?.length || 0,
        totalEnrollments: 3420,
        activeTeachers: 85
      });
      
      // Mock recent users
      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', joinedAt: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', joinedAt: '2024-01-14' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'student', joinedAt: '2024-01-13' }
      ]);
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loader fullScreen />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Manage your platform and monitor key metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              👥
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
              📚
            </div>
            <div className="stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              📊
            </div>
            <div className="stat-content">
              <h3>{stats.totalEnrollments}</h3>
              <p>Total Enrollments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
              👨‍🏫
            </div>
            <div className="stat-content">
              <h3>{stats.activeTeachers}</h3>
              <p>Active Teachers</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Courses */}
          <div className="content-section">
            <h2>Recent Courses</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>
                        <span className={`status-badge ${course.status}`}>
                          {course.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div className="content-section">
            <h2>Recent Users</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card">
              <span className="action-icon">👥</span>
              <span>Manage Users</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📚</span>
              <span>Manage Courses</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </button>
            <button className="action-card">
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;