import api from './api.js';

export const getAllSemesters = () => api.get('/semesters');
export const createSemester = (semesterData) => api.post('/semesters', semesterData);
