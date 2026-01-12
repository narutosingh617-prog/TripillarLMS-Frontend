import api from './api.js';

export const getAllEnrollments = () => api.get('/enrollments');
export const createEnrollment = (enrollmentData) => api.post('/enrollments', enrollmentData);
export const updateEnrollment = (id, updates) => api.put(`/enrollments/${id}`, updates);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);
