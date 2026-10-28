const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { validateBookingDates, checkRoomAvailability } = require('../utils/dateUtils');

// @desc    Get all rooms with optional filtering, search, and date availability check
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const {
      type,
      capacity,
      guests,
      minPrice,
      maxPrice,
      checkIn,
      checkOut,
      search,
      featured,
      status,
      limit,
    } = req.query;

    const query = {};

    // Only return available rooms for public unless status specified
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'Maintenance' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    const guestCount = Number(guests) || Number(capacity);
    if (guestCount) {
      query.capacity = { $gte: guestCount };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    let rooms = await Room.find(query).sort({ pricePerNight: 1 });

    // If checkIn and checkOut are provided, filter out rooms with conflicting bookings
    if (checkIn && checkOut) {
      const dateValidation = validateBookingDates(checkIn, checkOut);
      if (dateValidation.valid) {
        const { checkInUTC, checkOutUTC } = dateValidation;

        // Find bookings that overlap with requested range
        const overlappingBookings = await Booking.find({
          bookingStatus: { $in: ['Confirmed', 'Pending'] },
          checkIn: { $lt: checkOutUTC },
          checkOut: { $gt: checkInUTC },
        }).select('room');

        const bookedRoomIds = new Set(
          overlappingBookings.map((b) => b.room.toString())
        );

        rooms = rooms.filter((room) => !bookedRoomIds.has(room._id.toString()));
      }
    }

    if (limit && Number(limit) > 0) {
      rooms = rooms.slice(0, Number(limit));
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check availability for a specific room across dates
// @route   GET /api/rooms/:id/availability
// @access  Public
const checkSingleRoomAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (room.status === 'Maintenance') {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Room is currently under maintenance',
      });
    }

    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        available: false,
        message: dateValidation.error,
      });
    }

    const isAvailable = await checkRoomAvailability(
      room._id,
      dateValidation.checkInUTC,
      dateValidation.checkOutUTC
    );

    const nights = dateValidation.nights;
    const totalPrice = nights * room.pricePerNight;

    res.status(200).json({
      success: true,
      available: isAvailable,
      nights,
      pricePerNight: room.pricePerNight,
      totalPrice,
      message: isAvailable ? 'Room is available' : 'Room is already booked for these dates',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      title,
      type,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      status,
      bedType,
      roomSize,
      featured,
    } = req.body;

    if (!roomNumber || !title || !type || !pricePerNight || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomNumber, title, type, pricePerNight, and capacity',
      });
    }

    const roomExists = await Room.findOne({ roomNumber: roomNumber.trim().toUpperCase() });
    if (roomExists) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists`,
      });
    }

    // Default image if none provided
    const roomImages = Array.isArray(images) && images.length > 0
      ? images
      : [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        ];

    const room = await Room.create({
      roomNumber: roomNumber.trim().toUpperCase(),
      title: title.trim(),
      type,
      description: description || 'Experience utmost luxury and modern comfort.',
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      amenities: Array.isArray(amenities) ? amenities : ['High-speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Ensuite Bathroom'],
      images: roomImages,
      status: status || 'Available',
      bedType: bedType || '1 King Bed',
      roomSize: roomSize ? Number(roomSize) : 40,
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (req.body.roomNumber) {
      const roomNum = req.body.roomNumber.trim().toUpperCase();
      const existing = await Room.findOne({ roomNumber: roomNum, _id: { $ne: room._id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Room number ${roomNum} is already assigned to another room`,
        });
      }
      req.body.roomNumber = roomNum;
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room has active upcoming bookings
    const activeBookings = await Booking.find({
      room: room._id,
      bookingStatus: { $in: ['Confirmed', 'Pending'] },
      checkOut: { $gte: new Date() },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room. It has ${activeBookings.length} active or upcoming booking(s). Please cancel or reassign those bookings first.`,
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  checkSingleRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
};
