const Assessment = require('../models/Assessment');

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private (Teacher/Admin)
exports.createAssessment = async (req, res, next) => {
  try {
    const {
      title,
      type,
      duration,
      totalMarks,
      passingMarks,
      course,
      questions
    } = req.body;

    // Map frontend fields to DB fields
    const formattedData = {
      course_id: course,              // map course → course_id
      title,
      type,
      duration,                       // keep as is (or multiply if DB expects seconds)
      total_marks: totalMarks,        // map totalMarks → total_marks
      passing_marks: passingMarks,    // map passingMarks → passing_marks
      questions
    };

    const assessment = await Assessment.create(formattedData);

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      assessment
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get assessments by course
// @route   GET /api/assessments/course/:courseId
// @access  Private
exports.getCourseAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.findByCourse(req.params.courseId);
    
    res.status(200).json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Teacher/Admin)
exports.updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Teacher/Admin)
exports.deleteAssessment = async (req, res, next) => {
  try {
    await Assessment.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};