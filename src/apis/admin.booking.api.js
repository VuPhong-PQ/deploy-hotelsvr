import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/bookings';

export const fetchBookings = async ({ search = '', page = 1, pageSize = 10 } = {}) => {
  const params = {};
  if (search) params.search = search;
  params.page = page;
  params.pageSize = pageSize;
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const deleteBooking = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const updateBooking = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};
// Có thể bổ sung các API khác như: getBookingById nếu cần
