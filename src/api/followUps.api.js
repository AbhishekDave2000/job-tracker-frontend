import api from './axios';

export const getFollowUps = (jobApplicationId) => 
    api.get(`/follow_ups?job_application_id=${jobApplicationId}`);

export const getFollowUp = (id) => 
    api.get(`/follow_ups/${id}`);

export const createFollowUp = (jobApplicationId, data) => 
    api.post(`/follow_ups?job_application_id=${jobApplicationId}`, data);

export const completeFollowUp = (id) => 
    api.post(`/complete_follow_up/${id}`);

export const updateFollowUp = (id, data) => 
    api.put(`/follow_ups/${id}`, data);

export const deleteFollowUp = (id) => 
    api.delete(`/follow_ups/${id}`);