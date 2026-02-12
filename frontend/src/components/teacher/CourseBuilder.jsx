import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCourseById, 
  updateCourse,
  createModule, 
  updateModule, 
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadFile
} from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './CourseBuilder.css';

const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Module form state
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  
  // Lesson form state
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    content_type: 'video',
    content: '',
    duration: ''
  });
  const [lessonFile, setLessonFile] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setCourse(data.course);
      setModules(data.course.modules || []);
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Module Functions
  const handleAddModule = () => {
    setEditingModule(null);
    setModuleTitle('');
    setShowModuleForm(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setShowModuleForm(true);
  };

  const handleSaveModule = async () => {
    if (!moduleTitle.trim()) {
      alert('Module title is required');
      return;
    }

    try {
      setSaving(true);
      
      if (editingModule) {
        await updateModule(editingModule.id, { title: moduleTitle });
      } else {
        await createModule(id, { title: moduleTitle });
      }
      
      await fetchCourse();
      setShowModuleForm(false);
      setModuleTitle('');
      setEditingModule(null);
    } catch (err) {
      alert('Failed to save module');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module and all its lessons?')) {
      return;
    }

    try {
      await deleteModule(moduleId);
      await fetchCourse();
    } catch (err) {
      alert('Failed to delete module');
    }
  };

  // Lesson Functions
  const handleAddLesson = (moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setLessonData({
      title: '',
      content_type: 'video',
      content: '',
      duration: ''
    });
    setLessonFile(null);
    setShowLessonForm(true);
  };

  const handleEditLesson = (moduleId, lesson) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setLessonData({
      title: lesson.title,
      content_type: lesson.content_type,
      content: lesson.content || '',
      duration: lesson.duration || ''
    });
    setShowLessonForm(true);
  };

  const handleLessonDataChange = (e) => {
    const { name, value } = e.target;
    setLessonData({
      ...lessonData,
      [name]: value
    });
  };

  const handleLessonFileChange = (e) => {
    setLessonFile(e.target.files[0]);
  };

  const handleSaveLesson = async () => {
    if (!lessonData.title.trim()) {
      alert('Lesson title is required');
      return;
    }

    try {
      setSaving(true);
      
      let contentUrl = lessonData.content;
      
      if (lessonFile) {
        const fileType = lessonData.content_type === 'video' ? 'lesson-video' : 'lesson-file';
        const uploadData = await uploadFile(lessonFile, fileType);
        contentUrl = uploadData.url;
      }
      
      const lessonPayload = {
        ...lessonData,
        content_url: contentUrl,
        duration: parseInt(lessonData.duration) || null
      };
      
      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonPayload);
      } else {
        await createLesson(selectedModuleId, lessonPayload);
      }
      
      await fetchCourse();
      setShowLessonForm(false);
      setLessonData({ title: '', content_type: 'video', content: '', duration: '' });
      setLessonFile(null);
      setEditingLesson(null);
    } catch (err) {
      alert('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      await fetchCourse();
    } catch (err) {
      alert('Failed to delete lesson');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this course? It will be visible to students.')) {
      return;
    }

    try {
      await updateCourse(id, { status: 'published' });
      alert('Course published successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      alert('Failed to publish course');
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
    <div className="course-builder-page">
      <Navbar />
      
      <div className="course-builder-container">
        <div className="builder-header">
          <div>
            <h1>{course?.title}</h1>
            <p>Build your course structure by adding modules and lessons</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Back to Dashboard
            </button>
            {course?.status === 'draft' && (
              <button 
                className="btn btn-success"
                onClick={handlePublish}
              >
                Publish Course
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* ADD THIS NEW SECTION - Quick Actions */}
        <div className="builder-actions">
          <button 
            className="btn btn-primary"
            onClick={handleAddModule}
          >
            + Add Module
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => navigate(`/teacher/courses/${id}/quiz/create`)}
          >
            + Create Quiz
          </button>
        </div>

        {/* Modules List */}
        {modules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No modules yet</h3>
            <p>Start building your course by adding modules</p>
          </div>
        ) : (
          <div className="modules-list">
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="module-item">
                <div className="module-header">
                  <h3>
                    <span className="module-number">{moduleIndex + 1}.</span>
                    {module.title}
                  </h3>
                  <div className="module-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditModule(module)}
                      title="Edit module"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleAddLesson(module.id)}
                      title="Add lesson"
                    >
                      ➕
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteModule(module.id)}
                      title="Delete module"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Lessons List */}
                {module.lessons && module.lessons.length > 0 ? (
                  <div className="lessons-list">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="lesson-item">
                        <div className="lesson-info">
                          <span className="lesson-icon">
                            {lesson.content_type === 'video' ? '🎥' : '📄'}
                          </span>
                          <span className="lesson-title">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          {lesson.duration && (
                            <span className="lesson-duration">{lesson.duration} min</span>
                          )}
                        </div>
                        <div className="lesson-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleEditLesson(module.id, lesson)}
                            title="Edit lesson"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            title="Delete lesson"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-lessons">
                    <p>No lessons yet. Click + to add lessons to this module.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Module Form Modal */}
        {showModuleForm && (
          <div className="modal-overlay" onClick={() => setShowModuleForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingModule ? 'Edit Module' : 'Add New Module'}</h2>
              
              <div className="form-group">
                <label>Module Title</label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g., Introduction to JavaScript"
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModuleForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveModule}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Module'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Form Modal */}
        {showLessonForm && (
          <div className="modal-overlay" onClick={() => setShowLessonForm(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h2>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>
              
              <div className="form-group">
                <label>Lesson Title</label>
                <input
                  type="text"
                  name="title"
                  value={lessonData.title}
                  onChange={handleLessonDataChange}
                  placeholder="e.g., Variables and Data Types"
                />
              </div>

              <div className="form-group">
                <label>Content Type</label>
                <select
                  name="content_type"
                  value={lessonData.content_type}
                  onChange={handleLessonDataChange}
                >
                  <option value="video">Video</option>
                  <option value="text">Text/Article</option>
                  <option value="pdf">PDF Document</option>
                </select>
              </div>

              {lessonData.content_type === 'video' && (
                <div className="form-group">
                  <label>Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleLessonFileChange}
                  />
                  <small>Supported formats: MP4, AVI, MOV</small>
                </div>
              )}

              {lessonData.content_type === 'pdf' && (
                <div className="form-group">
                  <label>Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleLessonFileChange}
                  />
                </div>
              )}

              {lessonData.content_type === 'text' && (
                <div className="form-group">
                  <label>Lesson Content</label>
                  <textarea
                    name="content"
                    value={lessonData.content}
                    onChange={handleLessonDataChange}
                    placeholder="Write your lesson content here..."
                    rows="8"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={lessonData.duration}
                  onChange={handleLessonDataChange}
                  placeholder="e.g., 15"
                  min="1"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLessonForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveLesson}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Lesson'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilder;