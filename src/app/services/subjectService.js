import api from './api.js';

export const getAllSubjects = () => api.get('/subjects');
export const createSubject = (subjectData) => api.post('/subjects', subjectData);
export const updateSubject = (id, updates) => api.put(`/subjects/${id}`, updates);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);
