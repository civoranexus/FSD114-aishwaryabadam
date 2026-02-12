const Course = require('../models/Course');

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Teacher/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      teacher_id: req.user.id
    };
    
    const course = await Course.create(courseData);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
      status: req.query.status || 'published',
      teacherId: req.query.teacherId
    };
    
    // If user is teacher, show their own courses regardless of status
    if (req.user && req.user.role === 'teacher') {
      filters.teacherId = req.user.id;
      delete filters.status; // Show all statuses for teacher's own courses
    }
    
    // If user is admin, show all courses
    if (req.user && req.user.role === 'admin') {
      delete filters.status; // Show all statuses for admin
    }
    
    const courses = await Course.findAll(filters);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check ownership
    if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }
    
    const updatedCourse = await Course.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check ownership
    if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }
    
    await Course.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create module
// @route   POST /api/courses/:courseId/modules
// @access  Private (Teacher/Admin)
exports.createModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check ownership
    if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }
    
    const module = await Course.createModule(req.params.courseId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      module
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update module
// @route   PUT /api/courses/modules/:moduleId
// @access  Private (Teacher/Admin)
exports.updateModule = async (req, res, next) => {
  try {
    const module = await Course.updateModule(req.params.moduleId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      module
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete module
// @route   DELETE /api/courses/modules/:moduleId
// @access  Private (Teacher/Admin)
exports.deleteModule = async (req, res, next) => {
  try {
    await Course.deleteModule(req.params.moduleId);
    
    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lesson
// @route   POST /api/courses/modules/:moduleId/lessons
// @access  Private (Teacher/Admin)
exports.createLesson = async (req, res, next) => {
  try {
    const lesson = await Course.createLesson(req.params.moduleId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/lessons/:lessonId
// @access  Private (Teacher/Admin)
exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Course.updateLesson(req.params.lessonId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/lessons/:lessonId
// @access  Private (Teacher/Admin)
exports.deleteLesson = async (req, res, next) => {
  try {
    await Course.deleteLesson(req.params.lessonId);
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};