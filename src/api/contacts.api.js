import api from './axios'

export const getContacts = (jobApplicationId) => 
    api.get(`/contacts?job_application_id=${jobApplicationId}`);

export const getContact = (contactId) => 
    api.get(`/contacts/${contactId}`);

export const createContact = (jobApplicationId, data) => 
    api.post(`/contacts?job_application_id=${jobApplicationId}`, { contact: data });

export const updateContact = (id, data) => 
    api.put(`/contacts/${id}`, {contact: data} );

export const deleteContact = (id) => 
    api.delete(`/contacts/${id}`);
