const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { validateBookingDates, checkRoomAvailability } = require('../utils/dateUtils');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkIn date, and checkOut date',
      });
    }

    // 1. Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      });
    }

    const { checkInUTC, checkOutUTC, nights } = dateValidation;

    // 2. Fetch room and check its existence and status
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The selected room could not be found',
      });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This room is currently undergoing maintenance and cannot be booked',
      });
    }

    // 3. Validate guest count against room capacity
    const guestCount = Number(guests) || 1;
    if (guestCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room accommodates a maximum of ${room.capacity} guest(s)`,
      });
    }

    // 4. Server-side availability recheck to avoid overlapping bookings
    const isAvailable = await checkRoomAvailability(room._id, checkInUTC, checkOutUTC);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'The selected room is no longer available for the chosen dates. Please pick alternative dates or another room.',
      });
    }

    // 5. Server-derived pricing — NEVER trust frontend submitted price
    const pricePerNight = room.pricePerNight;
    const totalPrice = nights * pricePerNight;

    // 6. Create booking record
    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      checkIn: checkInUTC,
      checkOut: checkOutUTC,
      guests: guestCount,
      nights,
      pricePerNight,
      totalPrice,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Pending', // Explicitly Pending until actual payment integration
      specialRequests: specialRequests ? specialRequests.trim() : '',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'roomNumber title type pricePerNight images bedType roomSize')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'roomNumber title type pricePerNight images bedType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'roomNumber title type pricePerNight images amenities description')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure customer can only access their own booking (admins can access any)
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own bookings',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Role check: only owner or admin can cancel
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only cancel your own bookings',
      });
    }

    // Check if already cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    // Check if check-in has already arrived or passed (customers cannot cancel past bookings)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isAdmin && new Date(booking.checkIn) < today) {
      return res.status(400).json({
        success: false,
        message: 'Bookings with past check-in dates cannot be cancelled',
      });
    }

    booking.bookingStatus = 'Cancelled';
    if (booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('room', 'roomNumber title type pricePerNight images')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
