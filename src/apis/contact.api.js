import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contactmessages';

export const sendContactMessage = async (data) => {
  return axios.post(API_URL, data);
};
