import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourses } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0
  });

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses({ teacherId: user.id });
      const formattedCourses = (data.courses || []).map(course => ({
        ...course,
        moduleCount: course.module_count,
        enrollmentCount: course.enrollment_count
      }));

      setCourses(formattedCourses);
      
      // Calculate stats
      const total = data.courses?.length || 0;
      const published = data.courses?.filter(c => c.status === 'published').length || 0;
      const draft = data.courses?.filter(c => c.status === 'draft').length || 0;
      const students = data.courses?.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0) || 0;
      
      setStats({
        totalCourses: total,
        publishedCourses: published,
        draftCourses: draft,
        totalStudents: students
      });
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
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
    <div className="teacher-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Manage your courses and track student progress</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              📚
            </div>
            <div className="stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
              ✅
            </div>
            <div className="stat-content">
              <h3>{stats.publishedCourses}</h3>
              <p>Published</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              📝
            </div>
            <div className="stat-content">
              <h3>{stats.draftCourses}</h3>
              <p>Drafts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
              👥
            </div>
            <div className="stat-content">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/teacher/courses/create" className="action-btn">
            <span className="action-icon">➕</span>
            <span>Create New Course</span>
          </Link>
          <Link to="/teacher/analytics" className="action-btn">
            <span className="action-icon">📊</span>
            <span>View Analytics</span>
          </Link>
        </div>

        {/* Courses Section */}
        <div className="courses-section">
          <div className="section-header">
            <h2>My Courses</h2>
            <Link to="/teacher/courses/create" className="btn btn-primary">
              + Create Course
            </Link>
          </div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses yet</h3>
              <p>Create your first course and start teaching!</p>
              <Link to="/teacher/courses/create" className="btn btn-primary">
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-thumbnail">
                    <img 
                      src={course.thumbnail || '/assets/images/default-course.jpg'} 
                      alt={course.title}
                      onError={(e) => {
                        e.target.src = '/assets/images/default-course.jpg';
                      }}
                    />
                    <div className={`status-badge ${course.status}`}>
                      {course.status === 'published' ? '✓ Published' : '📝 Draft'}
                    </div>
                  </div>

                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="course-category">{course.category}</p>
                    
                    <div className="course-stats">
                      <div className="stat-item">
                        <span className="stat-icon">👥</span>
                        <span>{course.enrollmentCount || 0} students</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">📊</span>
                        <span>{course.moduleCount || 0} modules</span>
                      </div>
                    </div>

                    <div className="course-actions">
                      <Link 
                        to={`/teacher/courses/${course.id}/edit`} 
                        className="btn btn-secondary btn-sm"
                      >
                        Edit Course
                      </Link>
                      <Link 
                        to={`/teacher/courses/${course.id}/students`} 
                        className="btn btn-primary btn-sm"
                      >
                        View Students
                      </Link>
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
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p>New student enrolled in React Basics</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p>Published new module: Advanced JavaScript</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <p>5 students completed JavaScript Fundamentals</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;