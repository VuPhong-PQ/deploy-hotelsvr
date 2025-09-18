import axios from 'axios';

import { BASE_URL } from '../config';
const API_URL = `${BASE_URL}/contactmessages`;

export const sendContactMessage = async (data) => {
  return axios.post(API_URL, data);
};
