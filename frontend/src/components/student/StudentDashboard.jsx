import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEnrolledCourses } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await getEnrolledCourses();
      setEnrolledCourses(data.enrollments || []);
      
      // Calculate stats
      const total = data.enrollments?.length || 0;
      const completed = data.enrollments?.filter(e => e.progress >= 100).length || 0;
      const inProgress = data.enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0;
      
      setStats({
        totalCourses: total,
        completedCourses: completed,
        inProgressCourses: inProgress,
        totalHours: total * 5 // Approximate
      });
    } catch (err) {
      setError('Failed to load enrolled courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    if (progress >= 25) return '#3b82f6';
    return '#6b7280';
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
    <div className="student-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              📚
            </div>
            <div className="stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
              ✅
            </div>
            <div className="stat-content">
              <h3>{stats.completedCourses}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              ⏳
            </div>
            <div className="stat-content">
              <h3>{stats.inProgressCourses}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
              ⏱️
            </div>
            <div className="stat-content">
              <h3>{stats.totalHours}+</h3>
              <p>Learning Hours</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/courses" className="action-btn">
            <span className="action-icon">🔍</span>
            <span>Browse Courses</span>
          </Link>
          <Link to="/student/certificates" className="action-btn">
            <span className="action-icon">🎓</span>
            <span>My Certificates</span>
          </Link>
        </div>

        {/* Enrolled Courses Section */}
        <div className="courses-section">
          <div className="section-header">
            <h2>My Courses</h2>
            <Link to="/courses" className="view-all-link">
              View All Courses →
            </Link>
          </div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses yet</h3>
              <p>Start your learning journey by enrolling in a course</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="courses-grid">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment.id} className="course-card">
                  <div className="course-thumbnail">
                    <img 
                      src={enrollment.course?.thumbnail || '/assets/images/default-course.jpg'} 
                      alt={enrollment.course?.title}
                      onError={(e) => {
                        e.target.src = '/assets/images/default-course.jpg';
                      }}
                    />
                    {enrollment.progress >= 100 && (
                      <div className="completed-badge">✓ Completed</div>
                    )}
                  </div>

                  <div className="course-content">
                    <h3>{enrollment.course?.title}</h3>
                    <p className="course-category">{enrollment.course?.category}</p>
                    
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span className="progress-percentage">
                          {Math.round(enrollment.progress || 0)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${enrollment.progress || 0}%`,
                            backgroundColor: getProgressColor(enrollment.progress || 0)
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="course-actions">
                      {enrollment.progress >= 100 ? (
                        <>
                          <Link 
                            to={`/student/learn/${enrollment.course?.id}`} 
                            className="btn btn-secondary btn-sm"
                          >
                            Review Course
                          </Link>
                          <Link 
                            to={`/student/certificate/${enrollment.id}`} 
                            className="btn btn-primary btn-sm"
                          >
                            View Certificate
                          </Link>
                        </>
                      ) : (
                        <Link 
                          to={`/student/learn/${enrollment.course?.id}`} 
                          className="btn btn-primary btn-block"
                        >
                          {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📖</div>
              <div className="activity-content">
                <p>You started learning React Basics</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p>Completed quiz: JavaScript Fundamentals</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🎯</div>
              <div className="activity-content">
                <p>Enrolled in Advanced CSS Course</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;