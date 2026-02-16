const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getCourseAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('teacher', 'admin'), createAssessment);
router.get('/course/:courseId', protect, getCourseAssessments);
router.get('/:id', protect, getAssessment);
router.put('/:id', protect, authorize('teacher', 'admin'), updateAssessment);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteAssessment);

module.exports = router;