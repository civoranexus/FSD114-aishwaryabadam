const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');

// @desc    Submit assessment
// @route   POST /api/submissions
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId, answers } = req.body;
    
    // Get assessment to auto-grade if it's a quiz
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    let score = null;
    
    // Auto-grade for quizzes
    if (assessment.type === 'quiz' && assessment.questions) {
      let correctAnswers = 0;
      const totalQuestions = assessment.questions.length;
      
      assessment.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      score = Math.round((correctAnswers / totalQuestions) * 100);
    }
    
    const submission = await Submission.create({
      student_id: req.user.id,
      assessment_id: assessmentId,
      answers,
      score
    });
    
    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      submission: {
        ...submission,
        score,
        passed: score >= (assessment.passing_marks || 70)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions by assessment
// @route   GET /api/submissions/assessment/:assessmentId
// @access  Private (Teacher/Admin)
exports.getAssessmentSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.findByAssessment(req.params.assessmentId);
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student submissions
// @route   GET /api/submissions/student
// @access  Private (Student)
exports.getStudentSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.findByStudent(req.user.id);
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Teacher/Admin)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    
    if (grade === undefined || grade === null) {
      return res.status(400).json({
        success: false,
        message: 'Grade is required'
      });
    }
    
    const submission = await Submission.grade(req.params.id, grade, feedback);
    
    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};