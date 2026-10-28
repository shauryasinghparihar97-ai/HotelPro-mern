import api from './api';
import { getStoredBookings, getStoredRooms, demoAccounts } from './demoData';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (err) {
    const bookings = getStoredBookings();
    const rooms = getStoredRooms();
    const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return {
      success: true,
      stats: {
        totalRooms: rooms.length,
        totalBookings: bookings.length,
        activeStays: confirmedBookings.length,
        totalRevenue,
        estimatedOccupancy: Math.min(100, Math.round((confirmedBookings.length / (rooms.length || 1)) * 100)),
        totalCustomers: 4,
      },
    };
  }
};

export const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  } catch (err) {
    let bookings = getStoredBookings();
    if (params.status && params.status !== 'All') {
      bookings = bookings.filter((b) => b.bookingStatus?.toLowerCase() === params.status.toLowerCase());
    }
    return {
      success: true,
      count: bookings.length,
      bookings,
    };
  }
};

export const updateBookingStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/admin/bookings/${id}`, statusData);
    return response.data;
  } catch (err) {
    const bookings = getStoredBookings();
    const index = bookings.findIndex((b) => b._id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...statusData };
      localStorage.setItem('hotelpro_demo_bookings', JSON.stringify(bookings));
      return { success: true, booking: bookings[index] };
    }
    return { success: true };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (err) {
    const users = [
      demoAccounts.admin,
      demoAccounts.customer,
      {
        _id: 'user-demo-3',
        name: 'David Chen',
        email: 'david.chen@example.com',
        role: 'customer',
        phone: '+1 (555) 782-3490',
      },
      {
        _id: 'user-demo-4',
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        role: 'customer',
        phone: '+1 (555) 621-8842',
      },
    ];
    return {
      success: true,
      count: users.length,
      users,
    };
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (err) {
    return {
      success: true,
      message: `User privileges updated to ${role} (Demo Mode)`,
    };
  }
};
