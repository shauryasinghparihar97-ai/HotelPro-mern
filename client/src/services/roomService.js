import api from './api';
import { getStoredRooms, saveStoredRooms } from './demoData';

export const getRooms = async (params = {}) => {
  try {
    const response = await api.get('/rooms', { params });
    return response.data;
  } catch (err) {
    console.warn('[RoomService] Backend unavailable, using interactive demo store:', err.message);
    let rooms = [...getStoredRooms()];

    // Client-side filtering fallback for demo mode
    if (params.search) {
      const q = params.search.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.roomNumber?.includes(q) ||
          r.type?.toLowerCase().includes(q)
      );
    }

    if (params.type && params.type !== 'All') {
      rooms = rooms.filter((r) => r.type?.toLowerCase() === params.type.toLowerCase());
    }

    if (params.guests) {
      const g = parseInt(params.guests, 10);
      if (!isNaN(g)) {
        rooms = rooms.filter((r) => r.capacity >= g);
      }
    }

    if (params.maxPrice) {
      const max = parseFloat(params.maxPrice);
      if (!isNaN(max)) {
        rooms = rooms.filter((r) => r.pricePerNight <= max);
      }
    }

    if (params.minPrice) {
      const min = parseFloat(params.minPrice);
      if (!isNaN(min)) {
        rooms = rooms.filter((r) => r.pricePerNight >= min);
      }
    }

    return {
      success: true,
      count: rooms.length,
      rooms,
    };
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`[RoomService] Fetching room ${id} from demo store`);
    const rooms = getStoredRooms();
    const room = rooms.find((r) => r._id === id || r.roomNumber === id) || rooms[0];
    return {
      success: true,
      room,
    };
  }
};

export const checkRoomAvailability = async (id, checkIn, checkOut) => {
  try {
    const response = await api.get(`/rooms/${id}/availability`, {
      params: { checkIn, checkOut },
    });
    return response.data;
  } catch (err) {
    return {
      success: true,
      isAvailable: true,
      message: 'Suite is available for your selected dates',
    };
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await api.post('/rooms', roomData);
    return response.data;
  } catch (err) {
    const rooms = getStoredRooms();
    const newRoom = {
      ...roomData,
      _id: 'room-' + Date.now(),
      status: 'Available',
      rating: 4.8,
      featured: false,
    };
    rooms.unshift(newRoom);
    saveStoredRooms(rooms);
    return {
      success: true,
      room: newRoom,
    };
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  } catch (err) {
    const rooms = getStoredRooms();
    const index = rooms.findIndex((r) => r._id === id || r.roomNumber === id);
    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...roomData };
      saveStoredRooms(rooms);
      return { success: true, room: rooms[index] };
    }
    return { success: true, room: roomData };
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  } catch (err) {
    let rooms = getStoredRooms();
    rooms = rooms.filter((r) => r._id !== id && r.roomNumber !== id);
    saveStoredRooms(rooms);
    return { success: true, message: 'Room deleted from demo inventory' };
  }
};
