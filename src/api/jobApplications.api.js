import api from './axios';

export const getJobApplications = () => api.get("/job_applications");
export const getJobApplicationsByStatus = (status) => api.get(`/job_applications?status=${status}`);
export const getJobApplication = (id) => api.get(`/job_applications/${id}`);
export const createJobApplication = (data) => api.post('/job_applications', {application: data});
export const updateJobApplication = (id ,data) => api.put(`/job_applications/${id}`, {application: data});
export const deleteJobApplication = (id) => api.delete(`/job_applications/${id}`);