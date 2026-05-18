import api from './axios';

export const getJobApplications = () => api.get("/job_applications");
export const getJobApplication = (id) => api.get(`/job_applications/${id}`);
export const createJobApplication = (data) => api.post('/job_applications', data);
export const updateJobApplication = (id ,data) => api.put(`/job_applications/${id}`, data);
export const deleteJobApplication = (id) => api.delete(`/job_applications/${id}`);