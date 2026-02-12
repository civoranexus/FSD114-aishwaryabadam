import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseById, enrollCourse, getEnrolledCourses } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    if (user?.role === 'student') {
      checkEnrollment();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setCourse(data.course);
    } catch (err) {
        setError('Failed to load course details');
console.error(err);
} finally {
setLoading(false);
}
};
const checkEnrollment = async () => {
try {
const data = await getEnrolledCourses();
const enrolled = data.enrollments?.some(e => e.course?.id === parseInt(id));
setIsEnrolled(enrolled);
} catch (err) {
console.error('Failed to check enrollment:', err);
}
};
const handleEnroll = async () => {
if (!user) {
navigate('/login');
return;
}
if (user.role !== 'student') {
  setError('Only students can enroll in courses');
  return;
}

try {
  setEnrolling(true);
  await enrollCourse(id);
  setIsEnrolled(true);
  navigate(`/student/learn/${id}`);
} catch (err) {
  setError(err.response?.data?.message || 'Failed to enroll in course');
} finally {
  setEnrolling(false);
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
if (!course) {
return (
<div>
<Navbar />
<div className="error-message">Course not found</div>
</div>
);
}
return (
<div className="course-details-page">
<Navbar />
  <div className="course-details-container">
    {/* Course Header */}
    <div className="course-header">
      <div className="course-header-content">
        <div className="course-badge">{course.category}</div>
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="meta-item">
            <span className="meta-icon">👨‍🏫</span>
            <span>{course.teacher?.name || 'Instructor'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📚</span>
            <span>{course.modules?.length || 0} Modules</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>Self-paced</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {user?.role === 'student' && (
          <div className="course-actions">
            {isEnrolled ? (
              <button 
                onClick={() => navigate(`/student/learn/${id}`)}
                className="btn btn-primary btn-large"
              >
                Continue Learning
              </button>
            ) : (
              <button 
                onClick={handleEnroll}
                className="btn btn-primary btn-large"
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll Now (Free)' : `Enroll Now (₹${course.price})`}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="course-header-image">
        <img 
          src={course.thumbnail || '/assets/images/default-course.jpg'} 
          alt={course.title}
          onError={(e) => {
            e.target.src = '/assets/images/default-course.jpg';
          }}
        />
      </div>
    </div>

    {/* Course Content */}
    <div className="course-content-section">
      <h2>Course Content</h2>
      
      {course.modules && course.modules.length > 0 ? (
        <div className="modules-list">
          {course.modules.map((module, index) => (
            <div key={module.id} className="module-item">
              <div className="module-header">
                <h3>
                  <span className="module-number">{index + 1}.</span>
                  {module.title}
                </h3>
                <span className="lesson-count">
                  {module.lessons?.length || 0} lessons
                </span>
              </div>
              
              {module.lessons && module.lessons.length > 0 && (
                <div className="lessons-list">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-item">
                      <span className="lesson-icon">
                        {lesson.content_type === 'video' ? '🎥' : '📄'}
                      </span>
                      <span className="lesson-title">{lesson.title}</span>
                      {lesson.duration && (
                        <span className="lesson-duration">{lesson.duration} min</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-modules">
          <p>Course content is being prepared</p>
        </div>
      )}
    </div>

    {/* What You'll Learn */}
    <div className="learning-outcomes">
      <h2>What You'll Learn</h2>
      <div className="outcomes-grid">
        <div className="outcome-item">
          <span className="outcome-icon">✓</span>
          <span>Master core concepts and fundamentals</span>
        </div>
        <div className="outcome-item">
          <span className="outcome-icon">✓</span>
          <span>Build real-world projects</span>
        </div>
        <div className="outcome-item">
          <span className="outcome-icon">✓</span>
          <span>Get hands-on practice with assessments</span>
        </div>
        <div className="outcome-item">
          <span className="outcome-icon">✓</span>
          <span>Earn a certificate of completion</span>
        </div>
      </div>
    </div>
  </div>
</div>
);
};
export default CourseDetails;