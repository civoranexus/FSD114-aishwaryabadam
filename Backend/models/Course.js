const { pool } = require('../config/db');

class Course {
  // Create new course
  static async create(courseData) {
    const { teacher_id, title, description, category, thumbnail, price, status } = courseData;
    
    const query = `
      INSERT INTO courses (teacher_id, title, description, category, thumbnail, price, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const values = [
      teacher_id,
      title,
      description,
      category,
      thumbnail || null,
      price || 0,
      status || 'draft'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find course by ID with modules and lessons
  static async findById(id) {
    // Get course
    const courseQuery = `
      SELECT c.*, u.name as teacher_name, u.email as teacher_email
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.id = $1
    `;
    const courseResult = await pool.query(courseQuery, [id]);
    
    if (courseResult.rows.length === 0) {
      return null;
    }
    
    const course = courseResult.rows[0];
    
    // Get modules
    const modulesQuery = `
      SELECT * FROM modules 
      WHERE course_id = $1 
      ORDER BY order_index ASC, created_at ASC
    `;
    const modulesResult = await pool.query(modulesQuery, [id]);
    
    // Get lessons for each module
    const modules = await Promise.all(
      modulesResult.rows.map(async (module) => {
        const lessonsQuery = `
          SELECT * FROM lessons 
          WHERE module_id = $1 
          ORDER BY order_index ASC, created_at ASC
        `;
        const lessonsResult = await pool.query(lessonsQuery, [module.id]);
        return {
          ...module,
          lessons: lessonsResult.rows
        };
      })
    );
    
    course.modules = modules;
    return course;
  }

  // Find all courses with filters
  static async findAll(filters = {}) {
    let query = `
      SELECT c.*, u.name as teacher_name,
             (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollment_count,
             (SELECT COUNT(*) FROM modules WHERE course_id = c.id) as module_count
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND c.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND c.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.teacherId) {
      query += ` AND c.teacher_id = $${paramCount}`;
      values.push(filters.teacherId);
      paramCount++;
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update course
  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE courses 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete course
  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Create module
  static async createModule(courseId, moduleData) {
    const { title, order_index } = moduleData;
    
    const query = `
      INSERT INTO modules (course_id, title, order_index, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    
    const values = [courseId, title, order_index || 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update module
  static async updateModule(moduleId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    values.push(moduleId);
    const query = `
      UPDATE modules 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete module
  static async deleteModule(moduleId) {
    const query = 'DELETE FROM modules WHERE id = $1';
    await pool.query(query, [moduleId]);
  }

  // Create lesson
  static async createLesson(moduleId, lessonData) {
    const { title, content_type, content_url, content, duration, order_index } = lessonData;
    
    const query = `
      INSERT INTO lessons (module_id, title, content_type, content_url, content, duration, order_index, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const values = [
      moduleId,
      title,
      content_type || 'video',
      content_url || null,
      content || null,
      duration || null,
      order_index || 0
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update lesson
  static async updateLesson(lessonId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    values.push(lessonId);
    const query = `
      UPDATE lessons 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete lesson
  static async deleteLesson(lessonId) {
    const query = 'DELETE FROM lessons WHERE id = $1';
    await pool.query(query, [lessonId]);
  }
}

module.exports = Course;