import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    status: 'published'
  });

  const categories = [
    'All',
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Data Science',
    'Personal Development'
  ];

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const filterParams = {
        ...filters,
        category: filters.category === 'All' ? '' : filters.category
      };
      const data = await getCourses(filterParams);
      setCourses(data.courses || []);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
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
    <div className="course-list-page">
      <Navbar />
      
      <div className="course-list-container">
        {/* Header */}
        <div className="page-header">
          <h1>Explore Courses</h1>
          <p>Discover and learn from our extensive course library</p>
        </div>

        {/* Search and Filter */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${filters.category === category || (category === 'All' && !filters.category) ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Course Count */}
        <div className="course-count">
          <p>{courses.length} {courses.length === 1 ? 'course' : 'courses'} found</p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <Link 
                to={`/courses/${course.id}`} 
                key={course.id}
                className="course-item-card"
              >
                <div className="course-item-thumbnail">
                  <img 
                    src={course.thumbnail || '/assets/images/default-course.jpg'} 
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = '/assets/images/default-course.jpg';
                    }}
                  />
                  {course.price === 0 && (
                    <div className="free-badge">FREE</div>
                  )}
                </div>

                <div className="course-item-content">
                  <div className="course-item-category">
                    {course.category}
                  </div>
                  <h3>{course.title}</h3>
                  <p className="course-item-description">
                    {course.description?.substring(0, 100)}
                    {course.description?.length > 100 ? '...' : ''}
                  </p>

                  <div className="course-item-meta">
                    <div className="course-item-instructor">
                      <span className="instructor-icon">👨‍🏫</span>
                      <span>{course.teacher?.name || 'Instructor'}</span>
                    </div>
                    <div className="course-item-price">
                      {course.price === 0 ? (
                        <span className="price-free">Free</span>
                      ) : (
                        <span className="price-paid">₹{course.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;