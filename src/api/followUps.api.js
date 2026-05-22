import api from 'axios';

export const getFollowUps = (jobApplicationId) => api.get(`/follow_ups?job_application_id=${jobApplicationId}`);
export const getFollowUp = (id) => api.get(`/follow_ups/${id}`);
export const createFollowUp = (jobApplicationId, data) => api.post(`/follow_ups/${jobApplicationId}`, data);
export const updateFollowUP = (id, data) => api.put(`/follow_ups/${id}`, data);
export const deleteFollowUp = (id) => api.delete(`/follow_ups/${id}`);