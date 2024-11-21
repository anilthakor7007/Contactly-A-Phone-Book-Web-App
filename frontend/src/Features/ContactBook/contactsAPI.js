import axios from 'axios';

// Define API calls here
export const fetchContacts = () => axios.get('/api/contacts');
export const addContact = (contact) => axios.post('/api/contacts/create', contact);
export const updateContact = (id, contact) => axios.put(`/api/contacts/${id}`, contact);
export const deleteContact = (id) => axios.delete(`/api/contacts/${id}`);
