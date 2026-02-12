import api from './api';

// Course CRUD
export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const getCourses = async (filters = {}) => {
  const response = await api.get('/courses', { params: filters });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const updateCourse = async (id, updates) => {
  const response = await api.put(`/courses/${id}`, updates);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

// Module Management
export const createModule = async (courseId, moduleData) => {
  const response = await api.post(`/courses/${courseId}/modules`, moduleData);
  return response.data;
};

export const updateModule = async (moduleId, updates) => {
  const response = await api.put(`/courses/modules/${moduleId}`, updates);
  return response.data;
};

export const deleteModule = async (moduleId) => {
  const response = await api.delete(`/courses/modules/${moduleId}`);
  return response.data;
};

// Lesson Management
export const createLesson = async (moduleId, lessonData) => {
  const response = await api.post(`/courses/modules/${moduleId}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (lessonId, updates) => {
  const response = await api.put(`/courses/lessons/${lessonId}`, updates);
  return response.data;
};

export const deleteLesson = async (lessonId) => {
  const response = await api.delete(`/courses/lessons/${lessonId}`);
  return response.data;
};

// Enrollment
export const enrollCourse = async (courseId) => {
  const response = await api.post('/enrollments', { courseId });
  return response.data;
};

export const getEnrolledCourses = async () => {
  const response = await api.get('/enrollments');
  return response.data;
};

export const updateProgress = async (enrollmentId, lessonId) => {
  const response = await api.put(`/enrollments/${enrollmentId}/progress`, { lessonId });
  return response.data;
};

// Assessment
// Assessment
export const createAssessment = async (assessmentData) => {
  const response = await api.post('/assessments', assessmentData);
  return response.data;
};

export const getAssessments = async (courseId) => {
  const response = await api.get(`/assessments/course/${courseId}`);
  return response.data;
};

export const submitAssessment = async (assessmentId, answers) => {
  const response = await api.post('/submissions', { assessmentId, answers });
  return response.data;
};

export const getSubmissions = async (assessmentId) => {
  const response = await api.get(`/submissions/assessment/${assessmentId}`);
  return response.data;
};

export const gradeSubmission = async (submissionId, grade, feedback) => {
  const response = await api.put(`/submissions/${submissionId}/grade`, { grade, feedback });
  return response.data;
};


// File Upload
// File Upload
export const uploadFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file); // Change from 'thumbnail' to 'file'
  formData.append('type', type);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};