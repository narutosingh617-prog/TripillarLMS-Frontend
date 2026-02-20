import api from './api.js';

export const getAllUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, updates) => api.put(`/users/${id}`, updates);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const changePassword = (oldPassword, newPassword) => 
  api.post('/auth/change-password', { oldPassword, newPassword });
