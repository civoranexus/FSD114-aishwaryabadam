import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ progress = 0, completedLessons = 0, totalLessons = 0 }) => {
  const getProgressColor = () => {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    if (progress >= 25) return '#3b82f6';
    return '#6b7280';
  };

  const getProgressMessage = () => {
    if (progress === 100) return 'Course Completed! 🎉';
    if (progress >= 75) return 'Almost there! Keep going! 💪';
    if (progress >= 50) return 'Halfway through! 🚀';
    if (progress >= 25) return 'Great start! 👍';
    return 'Let\'s begin your journey! 🎯';
  };

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h4>Course Progress</h4>
        <span className="progress-percentage">{progress}%</span>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${progress}%`,
            backgroundColor: getProgressColor()
          }}
        >
          {progress > 10 && <span className="progress-text">{progress}%</span>}
        </div>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-value">{completedLessons}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-divider">|</div>
        <div className="stat-item">
          <span className="stat-value">{totalLessons - completedLessons}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-divider">|</div>
        <div className="stat-item">
          <span className="stat-value">{totalLessons}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="progress-message">
        <p>{getProgressMessage()}</p>
      </div>

      {progress === 100 && (
        <div className="completion-badge">
          <span className="badge-icon">🏆</span>
          <span>Certificate Ready!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;