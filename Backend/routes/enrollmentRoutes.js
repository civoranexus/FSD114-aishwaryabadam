const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getEnrollments,
  getCourseEnrollments,
  updateProgress,
  unenroll
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), enrollCourse);
router.get('/', protect, authorize('student'), getEnrollments);
router.get('/course/:courseId', protect, authorize('teacher', 'admin'), getCourseEnrollments);
router.put('/:id/progress', protect, authorize('student'), updateProgress);
router.delete('/:id', protect, authorize('student'), unenroll);

module.exports = router;