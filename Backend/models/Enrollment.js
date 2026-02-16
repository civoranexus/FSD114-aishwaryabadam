const { pool } = require('../config/db');

class Enrollment {
  // Create enrollment
  static async create(enrollmentData) {
    const { student_id, course_id } = enrollmentData;
    
    // Check if already enrolled
    const checkQuery = 'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2';
    const existing = await pool.query(checkQuery, [student_id, course_id]);
    
    if (existing.rows.length > 0) {
      throw new Error('Already enrolled in this course');
    }
    
    const query = `
      INSERT INTO enrollments (student_id, course_id, progress, enrolled_at)
      VALUES ($1, $2, 0, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [student_id, course_id]);
    return result.rows[0];
  }

  // Find enrollments by student
  static async findByStudent(studentId) {
    const query = `
      SELECT e.*, 
             c.title as course_title,
             c.description as course_description,
             c.category as course_category,
             c.thumbnail as course_thumbnail,
             u.name as teacher_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.teacher_id = u.id
      WHERE e.student_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    
    const result = await pool.query(query, [studentId]);
    
    // Format response
    return result.rows.map(row => ({
      id: row.id,
      progress: row.progress,
      enrolled_at: row.enrolled_at,
      completed_at: row.completed_at,
      course: {
        id: row.course_id,
        title: row.course_title,
        description: row.course_description,
        category: row.course_category,
        thumbnail: row.course_thumbnail,
        teacher: {
          name: row.teacher_name
        }
      }
    }));
  }

  // Find enrollments by course
  static async findByCourse(courseId) {
    const query = `
      SELECT e.*, 
             u.name as student_name,
             u.email as student_email
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      WHERE e.course_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  // Update progress
  static async updateProgress(enrollmentId, progress) {
    const query = `
      UPDATE enrollments 
      SET progress = $1,
          completed_at = CASE WHEN $1 >= 100 THEN NOW() ELSE NULL END
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [progress, enrollmentId]);
    return result.rows[0];
  }

  // Find enrollment by student and course
  static async findByStudentAndCourse(studentId, courseId) {
    const query = 'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2';
    const result = await pool.query(query, [studentId, courseId]);
    return result.rows[0];
  }

  // Delete enrollment
  static async delete(id) {
    const query = 'DELETE FROM enrollments WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Enrollment;