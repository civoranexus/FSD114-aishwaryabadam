import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createAssessment } from '../../services/courseService';
import Navbar from '../common/Navbar';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    type: 'quiz',
    duration: 30,
    totalMarks: 100,
    passingMarks: 70
  });
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setAssessmentData({
      ...assessmentData,
      [name]: value
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleAddOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, '']
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions
      });
    }
  };

  const handleAddQuestion = () => {
    // Validation
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      const validOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options');
        return;
      }
      if (!currentQuestion.correctAnswer) {
        alert('Please select the correct answer');
        return;
      }
    } else if (currentQuestion.type === 'true-false') {
      if (!currentQuestion.correctAnswer) {
        alert('Please select the correct answer');
        return;
      }
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now(),
      options: currentQuestion.type === 'multiple-choice' 
        ? currentQuestion.options.filter(opt => opt.trim() !== '')
        : currentQuestion.type === 'true-false'
        ? ['True', 'False']
        : []
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      
      const cleanedQuestions = questions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      
      const payload = {
        title: assessmentData.title,
        type: assessmentData.type,
        duration: Number(assessmentData.duration),
        totalMarks: Number(assessmentData.totalMarks),
        passingMarks: Number(assessmentData.passingMarks),
        course: id,
        questions: cleanedQuestions
      };
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      await createAssessment(payload);
      alert('Quiz created successfully!');
      navigate(`/teacher/courses/${id}/edit`);
    } catch (err) {
      console.error('Error creating assessment:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-page">
      <Navbar />
      
      <div className="create-quiz-container">
        <div className="page-header">
          <h1>Create Quiz/Assessment</h1>
          <p>Create assessments to test student knowledge</p>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Assessment Details */}
          <div className="form-section">
            <h3>Assessment Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Assessment Title</label>
                <input
                  type="text"
                  name="title"
                  value={assessmentData.title}
                  onChange={handleAssessmentChange}
                  placeholder="e.g., JavaScript Fundamentals Quiz"
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={assessmentData.type}
                  onChange={handleAssessmentChange}
                >
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={assessmentData.duration}
                  onChange={handleAssessmentChange}
                  min="5"
                  max="180"
                />
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={assessmentData.totalMarks}
                  onChange={handleAssessmentChange}
                  min="10"
                  max="1000"
                />
              </div>

              <div className="form-group">
                <label>Passing Marks (%)</label>
                <input
                  type="number"
                  name="passingMarks"
                  value={assessmentData.passingMarks}
                  onChange={handleAssessmentChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Add Question Form */}
          <div className="form-section">
            <h3>Add Questions</h3>
            
            <div className="question-form">
              <div className="form-group">
                <label>Question</label>
                <textarea
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  placeholder="Enter your question here..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Question Type</label>
                <select
                  name="type"
                  value={currentQuestion.type}
                  onChange={handleQuestionChange}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="options-section">
                  <label>Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="option-input-group">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {currentQuestion.options.length > 2 && (
                        <button
                          type="button"
                          className="btn-remove-option"
                          onClick={() => handleRemoveOption(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {currentQuestion.options.length < 6 && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddOption}
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Correct Answer</label>
                <select
                  name="correctAnswer"
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                >
                  <option value="">Select correct answer</option>
                  {currentQuestion.type === 'multiple-choice' 
                    ? currentQuestion.options
                        .filter(opt => opt.trim() !== '')
                        .map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))
                    : ['True', 'False'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                  }
                </select>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="form-section">
              <h3>Questions ({questions.length})</h3>
              
              <div className="questions-list">
                {questions.map((q, index) => (
                  <div key={q.id} className="question-item">
                    <div className="question-header">
                      <h4>{index + 1}. {q.question}</h4>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoveQuestion(q.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="question-details">
                      <p><strong>Type:</strong> {q.type}</p>
                      <p><strong>Options:</strong></p>
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i} className={opt === q.correctAnswer ? 'correct' : ''}>
                            {opt} {opt === q.correctAnswer && '✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/teacher/courses/${id}/edit`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;