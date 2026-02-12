import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateProgress } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import ProgressTracker from './ProgressTracker';
import './LearningInterface.css';

const LearningInterface = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log("Current URL:", window.location.pathname);
  }, []);


  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching course with ID:', courseId);
      const data = await getCourseById(courseId);
      console.log('Received data:', data);
      setCourse(data.course);
      
      // Set first lesson as current
      if (data.course.modules && data.course.modules.length > 0) {
        const firstModule = data.course.modules[0];
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          setCurrentModule(firstModule);
          setCurrentLesson(firstModule.lessons[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (module, lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    // Add to completed lessons
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      
      // Update progress in backend
      try {
        await updateProgress(courseId, currentLesson.id);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }

    // Move to next lesson
    handleNextLesson();
  };

  const handleNextLesson = () => {
    if (!course || !currentModule || !currentLesson) return;

    const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

    // Check if there's a next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLesson(currentModule.lessons[currentLessonIndex + 1]);
    } 
    // Check if there's a next module
    else if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      setCurrentModule(nextModule);
      setCurrentLesson(nextModule.lessons[0]);
    }
  };

  const handlePreviousLesson = () => {
    if (!course || !currentModule || !currentLesson) return;

    const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

    // Check if there's a previous lesson in current module
    if (currentLessonIndex > 0) {
      setCurrentLesson(currentModule.lessons[currentLessonIndex - 1]);
    }
    // Check if there's a previous module
    else if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1];
      setCurrentModule(prevModule);
      setCurrentLesson(prevModule.lessons[prevModule.lessons.length - 1]);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const calculateProgress = () => {
    if (!course || !course.modules) return 0;
    
    let totalLessons = 0;
    course.modules.forEach(module => {
      totalLessons += module.lessons?.length || 0;
    });
    
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
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
    <div className="learning-interface">
      <Navbar />
      
      <div className="learning-container">
        {/* Sidebar - Course Content */}
        <div className={`learning-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>{course.title}</h3>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <ProgressTracker 
            progress={calculateProgress()} 
            completedLessons={completedLessons.length}
            totalLessons={course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}
          />

          <div className="modules-navigation">
            {course.modules?.map((module) => (
              <div key={module.id} className="module-nav-item">
                <div className="module-nav-header">
                  <h4>{module.title}</h4>
                  <span className="module-lesson-count">
                    {module.lessons?.length || 0} lessons
                  </span>
                </div>
                
                <div className="lessons-nav-list">
                  {module.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`lesson-nav-item ${currentLesson?.id === lesson.id ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                      onClick={() => handleLessonSelect(module, lesson)}
                    >
                      <span className="lesson-status-icon">
                        {isLessonCompleted(lesson.id) ? '✓' : 
                         lesson.content_type === 'video' ? '🎥' : '📄'}
                      </span>
                      <span className="lesson-nav-title">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="learning-main">
          {currentLesson ? (
            <>
              <div className="lesson-header">
                <h2>{currentLesson.title}</h2>
                <p className="lesson-meta">
                  {currentModule?.title} • Lesson {currentModule?.lessons?.findIndex(l => l.id === currentLesson.id) + 1}
                </p>
              </div>

              <div className="lesson-content">
                {currentLesson.content_type === 'video' ? (
                  <div className="video-player">
                    {currentLesson.content_url ? (
                      <video 
                        controls 
                        width="100%"
                        key={currentLesson.id}
                      >
                        <source src={currentLesson.content_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="placeholder-video">
                        <p>Video content will be available here</p>
                      </div>
                    )}
                  </div>
                ) : currentLesson.content_type === 'text' ? (
                  <div className="text-content">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content || '<p>Content will be displayed here</p>' }} />
                  </div>
                ) : currentLesson.content_type === 'pdf' ? (
                  <div className="pdf-viewer">
                    {currentLesson.content_url ? (
                      (() => {
                        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                        const backendOrigin = apiBase.replace(/\/api\/?$/, '');
                        // If backend returned a path that includes '/api' prefix (e.g. '/api/uploads/...'),
                        // strip the '/api' so it matches the static '/uploads' route on the server.
                        let pathPart = currentLesson.content_url || '';
                        if (pathPart.startsWith('/api')) {
                          pathPart = pathPart.replace(/^\/api/, '');
                        }
                        if (!pathPart.startsWith('/')) pathPart = '/' + pathPart;

                        // If content_url looks like a direct uploads path, use it first.
                        let url = currentLesson.content_url.startsWith('http')
                          ? currentLesson.content_url
                          : `${backendOrigin}${pathPart}`;

                        // But sometimes the stored content_url contains the original filename (without the unique suffix)
                        // and the file on disk has a suffix. In that case the static path will 404. To handle this,
                        // provide an alternative download endpoint that will locate the stored file by partial name.
                        // Build a fallback URL to the backend download route using the last path segment as name.
                        const segments = pathPart.split('/').filter(Boolean);
                        if (segments.length >= 2) {
                          const type = segments[0]; // e.g. 'uploads' or 'uploads' then 'lesson-file'
                          // If path starts with 'uploads', type is next segment (lesson-file, lesson-video, etc.)
                          const uploadType = segments[0] === 'uploads' ? segments[1] : segments[0];
                          const rawName = segments[segments.length - 1];
                          const downloadUrl = `${backendOrigin}/api/upload/download?type=${encodeURIComponent(uploadType)}&name=${encodeURIComponent(rawName)}`;

                          // Use the download endpoint as the iframe src. This endpoint will attempt to find the
                          // actual stored filename that contains the original name and send that file.
                          url = downloadUrl;
                        }

                        return (
                          <iframe
                            src={url}
                            width="100%"
                            height="600px"
                            title={currentLesson.title}
                          />
                        );
                      })()
                    ) : (
                      <div className="placeholder-pdf">
                        <p>PDF content will be available here</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="generic-content">
                    <p>{currentLesson.content || 'Content will be displayed here'}</p>
                  </div>
                )}
              </div>

              <div className="lesson-navigation">
                <button 
                  className="btn btn-secondary"
                  onClick={handlePreviousLesson}
                  disabled={course.modules[0].lessons[0].id === currentLesson.id}
                >
                  ← Previous Lesson
                </button>

                <button 
                  className="btn btn-success"
                  onClick={handleMarkComplete}
                  disabled={isLessonCompleted(currentLesson.id)}
                >
                  {isLessonCompleted(currentLesson.id) ? '✓ Completed' : 'Mark as Complete'}
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={handleNextLesson}
                >
                  Next Lesson →
                </button>
              </div>
            </>
          ) : (
            <div className="no-lesson-selected">
              <h3>Select a lesson to start learning</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningInterface;