import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessments, submitAssessment } from '../../services/courseService';
import Navbar from '../common/Navbar';
import Loader from '../common/Loader';
import './QuizInterface.css';

const QuizInterface = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      // Mock assessment data - replace with actual API call
      const mockAssessment = {
        id: assessmentId,
        title: 'JavaScript Fundamentals Quiz',
        type: 'quiz',
        duration: 1800, // 30 minutes in seconds
        totalMarks: 100,
        questions: [
          {
            id: 1,
            question: 'What is the output of: console.log(typeof null)?',
            type: 'multiple-choice',
            options: ['object', 'null', 'undefined', 'number'],
            correctAnswer: 'object'
          },
          {
            id: 2,
            question: 'Which keyword is used to declare a variable in JavaScript?',
            type: 'multiple-choice',
            options: ['var', 'let', 'const', 'All of the above'],
            correctAnswer: 'All of the above'
          },
          {
            id: 3,
            question: 'What does DOM stand for?',
            type: 'multiple-choice',
            options: [
              'Document Object Model',
              'Data Object Model',
              'Document Oriented Model',
              'Digital Object Management'
            ],
            correctAnswer: 'Document Object Model'
          },
          {
            id: 4,
            question: 'Is JavaScript case-sensitive?',
            type: 'true-false',
            options: ['True', 'False'],
            correctAnswer: 'True'
          },
          {
            id: 5,
            question: 'Which method is used to add an element at the end of an array?',
            type: 'multiple-choice',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 'push()'
          }
        ]
      };
      
      setAssessment(mockAssessment);
      setTimeLeft(mockAssessment.duration);
    } catch (err) {
      console.error('Failed to load assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const confirmed = window.confirm('Are you sure you want to submit your quiz?');
    if (!confirmed) return;

    try {
      setSubmitting(true);
      
      // Calculate score
      let score = 0;
      assessment.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
      
      const percentage = Math.round((score / assessment.questions.length) * 100);
      
      // Submit to backend
      await submitAssessment(assessmentId, answers);
      
      setResults({
        score,
        total: assessment.questions.length,
        percentage,
        passed: percentage >= 70
      });
      
      setShowResults(true);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return '#ef4444';
    if (timeLeft <= 300) return '#f59e0b';
    return '#10b981';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loader fullScreen />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-interface">
        <Navbar />
        <div className="quiz-container">
          <div className="quiz-results">
            <div className={`result-icon ${results.passed ? 'passed' : 'failed'}`}>
              {results.passed ? '🎉' : '📚'}
            </div>
            <h1>{results.passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
            <p className="result-message">
              {results.passed 
                ? 'You have successfully passed this quiz!' 
                : 'You need 70% to pass. Review the material and try again.'}
            </p>
            
            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-value">{results.score}</span>
                <span className="stat-label">Correct Answers</span>
              </div>
              <div className="result-stat">
                <span className="stat-value">{results.total}</span>
                <span className="stat-label">Total Questions</span>
              </div>
              <div className="result-stat">
                <span className={`stat-value ${results.passed ? 'passed' : 'failed'}`}>
                  {results.percentage}%
                </span>
                <span className="stat-label">Score</span>
              </div>
            </div>

            <div className="result-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/student/dashboard')}
              >
                Back to Dashboard
              </button>
              {!results.passed && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.location.reload()}
                >
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="quiz-interface">
      <Navbar />
      
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>{assessment.title}</h1>
          <div className="quiz-info">
            <div className="info-item">
              <span>Questions: {assessment.questions.length}</span>
            </div>
            <div className="info-item">
              <span>Total Marks: {assessment.totalMarks}</span>
            </div>
            {timeLeft !== null && (
              <div className="timer" style={{ color: getTimeColor() }}>
                <span className="timer-icon">⏱️</span>
                <span className="timer-text">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="quiz-progress">
          <div className="progress-text">
            Question {currentQuestion + 1} of {assessment.questions.length}
</div>
<div className="progress-bar">
<div
  className="progress-fill"
  style={{
    width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%`
  }}
/>
</div>
</div>
    <div className="quiz-content">
      <div className="question-card">
        <h2 className="question-text">
          {currentQuestion + 1}. {currentQ.question}
        </h2>

        <div className="options-list">
          {currentQ.options.map((option, index) => (
            <label 
              key={index}
              className={`option-item ${answers[currentQ.id] === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option}
                checked={answers[currentQ.id] === option}
                onChange={() => handleAnswerChange(currentQ.id, option)}
              />
              <span className="option-label">{option}</span>
              <span className="option-check">✓</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    <div className="quiz-navigation">
      <button
        className="btn btn-secondary"
        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
        disabled={currentQuestion === 0}
      >
        Previous
      </button>

      <div className="question-indicators">
        {assessment.questions.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentQuestion === index ? 'active' : ''} ${answers[assessment.questions[index].id] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {currentQuestion < assessment.questions.length - 1 ? (
        <button
          className="btn btn-primary"
          onClick={() => setCurrentQuestion(currentQuestion + 1)}
        >
          Next
        </button>
      ) : (
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      )}
    </div>
  </div>
</div>
);
};

export default QuizInterface;