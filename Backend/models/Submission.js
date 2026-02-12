const { pool } = require('../config/db');

class Submission {
  // Create submission
  static async create(submissionData) {
    const { student_id, assessment_id, answers, score } = submissionData;
    
    const query = `
      INSERT INTO submissions (student_id, assessment_id, answers, score, status, submitted_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const values = [
      student_id,
      assessment_id,
      JSON.stringify(answers || {}),
      score || null,
      score !== null ? 'graded' : 'pending'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find submission by ID
  static async findById(id) {
    const query = `
      SELECT s.*, 
             u.name as student_name,
             u.email as student_email,
             a.title as assessment_title
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      JOIN assessments a ON s.assessment_id = a.id
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length > 0) {
      const submission = result.rows[0];
      submission.answers = JSON.parse(submission.answers || '{}');
      return submission;
    }
    
    return null;
  }

  // Find submissions by assessment
  static async findByAssessment(assessmentId) {
    const query = `
      SELECT s.*, 
             u.name as student_name,
             u.email as student_email
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.assessment_id = $1
      ORDER BY s.submitted_at DESC
    `;
    
    const result = await pool.query(query, [assessmentId]);
    
    return result.rows.map(submission => ({
      ...submission,
      answers: JSON.parse(submission.answers || '{}'),
      student: {
        name: submission.student_name,
        email: submission.student_email
      }
    }));
  }

  // Find submissions by student
  static async findByStudent(studentId) {
    const query = `
      SELECT s.*, 
             a.title as assessment_title,
             a.type as assessment_type,
             c.title as course_title
      FROM submissions s
      JOIN assessments a ON s.assessment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE s.student_id = $1
      ORDER BY s.submitted_at DESC
    `;
    
    const result = await pool.query(query, [studentId]);
    
    return result.rows.map(submission => ({
      ...submission,
      answers: JSON.parse(submission.answers || '{}')
    }));
  }

  // Grade submission
  static async grade(id, score, feedback) {
    const query = `
      UPDATE submissions 
      SET score = $1, feedback = $2, status = 'graded', graded_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [score, feedback || null, id]);
    
    if (result.rows.length > 0) {
      const submission = result.rows[0];
      submission.answers = JSON.parse(submission.answers || '{}');
      return submission;
    }
    
    return null;
  }

  // Delete submission
  static async delete(id) {
    const query = 'DELETE FROM submissions WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Submission;