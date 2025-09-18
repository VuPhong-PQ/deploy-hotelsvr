import axios from 'axios';

import { BASE_URL } from '../config';
const API_URL = `${BASE_URL}/admin/contactmessages`;

export const fetchContactMessages = async ({ search = '', page = 1, pageSize = 10 } = {}) => {
  const params = {};
  if (search) params.search = search;
  params.page = page;
  params.pageSize = pageSize;
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const deleteContactMessage = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
