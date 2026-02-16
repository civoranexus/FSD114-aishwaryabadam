import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, uploadFile } from '../../services/courseService';
import Navbar from '../common/Navbar';
import './CreateCourse.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    status: 'draft'
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Data Science',
    'Personal Development',
    'Photography',
    'Music',
    'Language',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Thumbnail size should be less than 5MB');
        return;
      }
      
      setThumbnail(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Course description is required');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);

      // Upload thumbnail first if provided
      let thumbnailUrl = null;
      if (thumbnail) {
        const uploadData = await uploadFile(thumbnail, 'course-thumbnail');
        thumbnailUrl = uploadData.url;
      }

      // Create course
      const courseData = {
        ...formData,
        thumbnail: thumbnailUrl,
        price: parseFloat(formData.price) || 0
      };

      const response = await createCourse(courseData);
      
      // Navigate to course builder
      navigate(`/teacher/courses/${response.course.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <Navbar />
      
      <div className="create-course-container">
        <div className="page-header">
          <h1>Create New Course</h1>
          <p>Fill in the basic information about your course</p>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete JavaScript Masterclass"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                rows="5"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0 for free course"
                  min="0"
                  step="1"
                  disabled={loading}
                />
                <small>Set to 0 for a free course</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Course Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="draft">Draft (Not visible to students)</option>
                <option value="published">Published (Visible to students)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Course Thumbnail</h3>
            
            <div className="form-group">
              <label htmlFor="thumbnail">Upload Thumbnail</label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={loading}
              />
              <small>Recommended size: 1280x720px (16:9 ratio). Max 5MB.</small>
            </div>

            {thumbnailPreview && (
              <div className="thumbnail-preview">
                <img src={thumbnailPreview} alt="Thumbnail preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/teacher/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;