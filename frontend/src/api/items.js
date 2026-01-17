import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const itemsAPI = {
  getAll: () => axios.get(`${API_URL}/items`),
  getById: (id) => axios.get(`${API_URL}/items/${id}`),
  create: (item) => axios.post(`${API_URL}/items`, item),
  update: (id, item) => axios.put(`${API_URL}/items/${id}`, item),
  delete: (id) => axios.delete(`${API_URL}/items/${id}`)
};