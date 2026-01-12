import api from './api.js';

export const getAllVideos = () => api.get('/videos');
export const createVideo = (formData) => {
  return api.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
