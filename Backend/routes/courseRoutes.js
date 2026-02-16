const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Course routes
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);

// Module routes
router.post('/:courseId/modules', protect, authorize('teacher', 'admin'), createModule);
router.put('/modules/:moduleId', protect, authorize('teacher', 'admin'), updateModule);
router.delete('/modules/:moduleId', protect, authorize('teacher', 'admin'), deleteModule);

// Lesson routes
router.post('/modules/:moduleId/lessons', protect, authorize('teacher', 'admin'), createLesson);
router.put('/lessons/:lessonId', protect, authorize('teacher', 'admin'), updateLesson);
router.delete('/lessons/:lessonId', protect, authorize('teacher', 'admin'), deleteLesson);

module.exports = router;