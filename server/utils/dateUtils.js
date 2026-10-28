const Booking = require('../models/Booking');

/**
 * Normalizes a date to midnight UTC for consistent calendar comparison
 */
const toMidnightUTC = (dateInput) => {
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
};

/**
 * Calculates whole number of nights between two dates
 */
const calculateNights = (checkInDate, checkOutDate) => {
  const start = toMidnightUTC(checkInDate);
  const end = toMidnightUTC(checkOutDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Validates check-in and check-out dates
 * Returns { valid: boolean, error: string|null, nights: number }
 */
const validateBookingDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Both check-in and check-out dates are required' };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  const nowUTC = toMidnightUTC(new Date());
  const checkInUTC = toMidnightUTC(checkInDate);
  const checkOutUTC = toMidnightUTC(checkOutDate);

  if (checkInUTC < nowUTC) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }

  if (checkOutUTC <= checkInUTC) {
    return { valid: false, error: 'Check-out date must be strictly after check-in date' };
  }

  const nights = calculateNights(checkInUTC, checkOutUTC);
  if (nights < 1) {
    return { valid: false, error: 'Booking must be for at least one night' };
  }

  if (nights > 90) {
    return { valid: false, error: 'Bookings cannot exceed 90 nights' };
  }

  return { valid: true, error: null, nights, checkInUTC, checkOutUTC };
};

/**
 * Checks if a room has any overlapping confirmed/pending bookings
 */
const checkRoomAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    room: roomId,
    bookingStatus: { $in: ['Confirmed', 'Pending'] },
    // Standard interval overlap condition:
    // Existing booking overlaps if it starts before requested check-out AND ends after requested check-in
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query).select('_id checkIn checkOut bookingStatus');
  return !conflictingBooking;
};

module.exports = {
  toMidnightUTC,
  calculateNights,
  validateBookingDates,
  checkRoomAvailability,
};
