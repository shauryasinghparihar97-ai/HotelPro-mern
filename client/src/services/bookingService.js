import api from './api';
import {
  getStoredBookings,
  addDemoBooking,
  cancelDemoBooking as cancelStoredDemoBooking,
} from './demoData';

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (err) {
    console.warn('[BookingService] Backend unavailable, saving booking to demo store');
    const userStr = localStorage.getItem('hotelpro_user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const newBooking = addDemoBooking(bookingData, currentUser);
    return {
      success: true,
      message: 'Suite reserved successfully (Demo Mode)',
      booking: newBooking,
    };
  }
};

export const getMyBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (err) {
    console.warn('[BookingService] Fetching bookings from demo store');
    const bookings = getStoredBookings();
    return {
      success: true,
      count: bookings.length,
      bookings,
    };
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (err) {
    const bookings = getStoredBookings();
    const booking =
      bookings.find((b) => b._id === id || b.bookingReference === id) || bookings[0];
    return {
      success: true,
      booking,
    };
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  } catch (err) {
    const updated = cancelStoredDemoBooking(id);
    return {
      success: true,
      message: 'Reservation cancelled successfully',
      booking: updated,
    };
  }
};
