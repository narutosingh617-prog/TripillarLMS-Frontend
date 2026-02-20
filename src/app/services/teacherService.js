import api from './api.js';

// Use existing users endpoint and filter on frontend
export const getAllTeachers = () => api.get('/users');
