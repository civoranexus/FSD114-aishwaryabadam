const { pool } = require('../config/db');

class Assessment {
  // Create assessment
  static async create(assessmentData) {
    const { course_id, lesson_id, title, type, duration, total_marks, passing_marks, questions } = assessmentData;
    
    const query = `
      INSERT INTO assessments (course_id, lesson_id, title, type, duration, total_marks, passing_marks, questions, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    
    const values = [
      course_id,
      lesson_id || null,
      title,
      type || 'quiz',
      duration || 1800, // 30 minutes default
      total_marks || 100,
      passing_marks || 70,
      JSON.stringify(questions || [])
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find assessment by ID
  static async findById(id) {
    const query = 'SELECT * FROM assessments WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length > 0) {
      const assessment = result.rows[0];
      // Parse questions JSON
      assessment.questions = JSON.parse(assessment.questions || '[]');
      return assessment;
    }
    
    return null;
  }

  // Find assessments by course
  static async findByCourse(courseId) {
    const query = 'SELECT * FROM assessments WHERE course_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [courseId]);
    
    return result.rows.map(assessment => ({
      ...assessment,
      questions: JSON.parse(assessment.questions || '[]')
    }));
  }

  // Update assessment
  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'questions') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
        }
        paramCount++;
      }
    });

    values.push(id);
    const query = `
      UPDATE assessments 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const assessment = result.rows[0];
    assessment.questions = JSON.parse(assessment.questions || '[]');
    return assessment;
  }

  // Delete assessment
  static async delete(id) {
    const query = 'DELETE FROM assessments WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Assessment;