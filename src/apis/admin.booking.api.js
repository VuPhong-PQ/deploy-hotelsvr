
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/bookings';

// Tạo mới booking (dùng axios để đồng bộ với các API khác)
export async function createBooking(data) {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (err) {
    // Trả về lỗi chi tiết nếu có
    if (err.response && err.response.data) {
      throw new Error(err.response.data.message || JSON.stringify(err.response.data));
    }
    throw new Error(err.message || 'Lỗi tạo booking');
  }
}

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
