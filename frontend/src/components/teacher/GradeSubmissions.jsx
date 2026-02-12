import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSubmissions, gradeSubmission } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './GradeSubmissions.css';

const GradeSubmissions = () => {
  const { assessmentId } = useParams();
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({
    grade: '',
    feedback: ''
  });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assessmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissions(assessmentId);
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
  };

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeData({
      ...gradeData,
      [name]: value
    });
  };

  const handleSubmitGrade = async () => {
    if (!gradeData.grade) {
      alert('Please enter a grade');
      return;
    }

    try {
      setGrading(true);
      await gradeSubmission(
        selectedSubmission.id,
        parseFloat(gradeData.grade),
        gradeData.feedback
      );
      
      alert('Grade submitted successfully!');
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      alert('Failed to submit grade');
    } finally {
      setGrading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
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
    <div className="grade-submissions-page">
      <Navbar />
      
      <div className="grade-container">
        <div className="page-header">
          <h1>Grade Submissions</h1>
          <p>Review and grade student submissions</p>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No submissions yet</h3>
            <p>Students haven't submitted any work for this assessment</p>
          </div>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div className="student-info">
                    <h3>{submission.student?.name || 'Student'}</h3>
                    <p className="student-email">{submission.student?.email}</p>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(submission.status) }}
                  >
                    {submission.status === 'graded' ? 'Graded' : 'Pending'}
                  </div>
                </div>

                <div className="submission-details">
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                  {submission.grade && (
                    <div className="detail-item">
                      <span className="detail-label">Grade:</span>
                      <span className="grade-value">{submission.grade}%</span>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewSubmission(submission)}
                >
                  {submission.status === 'graded' ? 'View & Edit Grade' : 'Review Submission'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Grading Modal */}
        {selectedSubmission && (
          <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h2>Grade Submission</h2>
              
              <div className="student-details">
                <h3>{selectedSubmission.student?.name}</h3>
                <p>{selectedSubmission.student?.email}</p>
                <p>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              </div>

              <div className="submission-content">
                <h4>Student Answers:</h4>
                {selectedSubmission.answers && Object.keys(selectedSubmission.answers).length > 0 ? (
                  <div className="answers-list">
                    {Object.entries(selectedSubmission.answers).map(([questionId, answer], index) => (
                      <div key={questionId} className="answer-item">
                        <p><strong>Question {index + 1}:</strong></p>
                        <p className="student-answer">{answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No answers provided</p>
                )}
              </div>

              <div className="grading-form">
                <div className="form-group">
                  <label>Grade (out of 100)</label>
                  <input
                    type="number"
                    name="grade"
                    value={gradeData.grade}
                    onChange={handleGradeChange}
                    placeholder="Enter grade"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label>Feedback (Optional)</label>
                  <textarea
                    name="feedback"
                    value={gradeData.feedback}
                    onChange={handleGradeChange}
                    placeholder="Provide feedback to the student..."
                    rows="5"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedSubmission(null)}
                  disabled={grading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitGrade}
                  disabled={grading}
                >
                  {grading ? 'Submitting...' : 'Submit Grade'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeSubmissions;