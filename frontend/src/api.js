import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Rooms
export const getRooms = () => API.get('/rooms');
export const checkAvailability = (checkIn, checkOut, type) =>
  API.get('/rooms/availability', { params: { checkIn, checkOut, type } });

// Bookings
export const getBookings = () => API.get('/bookings');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

export default API;
