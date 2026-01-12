import api from './api.js';

export const getAllNotes = () => api.get('/notes');
export const createNote = (formData) => {
  return api.post('/notes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteNote = (id) => api.delete(`/notes/${id}`);
