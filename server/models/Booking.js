const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Booking must specify a room'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide a check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide a check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
      min: [1, 'At least 1 guest is required'],
    },
    nights: {
      type: Number,
      required: true,
      min: [1, 'Booking must be for at least 1 night'],
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingStatus: {
      type: String,
      enum: {
        values: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Paid', 'Refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Pending',
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help fast overlap queries
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, bookingStatus: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
