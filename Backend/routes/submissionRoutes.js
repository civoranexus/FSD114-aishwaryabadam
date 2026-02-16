const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getAssessmentSubmissions,
  getStudentSubmissions,
  gradeSubmission
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), submitAssessment);
router.get('/assessment/:assessmentId', protect, authorize('teacher', 'admin'), getAssessmentSubmissions);
router.get('/student', protect, authorize('student'), getStudentSubmissions);
router.put('/:id/grade', protect, authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;