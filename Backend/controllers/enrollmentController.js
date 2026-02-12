const Enrollment = require('../models/Enrollment');

// @desc    Enroll in course
// @route   POST /api/enrollments
// @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    const enrollment = await Enrollment.create({
      student_id: req.user.id,
      course_id: courseId
    });
    
    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (error) {
    if (error.message === 'Already enrolled in this course') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private (Student)
exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findByStudent(req.user.id);
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course enrollments
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Teacher/Admin)
exports.getCourseEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findByCourse(req.params.courseId);
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    
    // For simplicity, we'll calculate progress based on lessons completed
    // In a real app, you'd track individual lesson completion
    const progress = req.body.progress || 0;
    
    const enrollment = await Enrollment.updateProgress(req.params.id, progress);
    
    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:id
// @access  Private (Student)
exports.unenroll = async (req, res, next) => {
  try {
    await Enrollment.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Unenrolled successfully'
    });
  } catch (error) {
    next(error);
  }
};