const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a room title'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please provide a room type'],
      enum: {
        values: ['Single', 'Double', 'Deluxe', 'Suite', 'Presidential'],
        message: '{VALUE} is not a valid room type',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a room description'],
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide a price per night'],
      min: [1, 'Price per night must be at least 1'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide maximum guest capacity'],
      min: [1, 'Capacity must be at least 1 guest'],
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Ensuite Bathroom'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one room image URL'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A room must have at least one image',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Booked', 'Maintenance'],
        message: '{VALUE} is not a valid room status',
      },
      default: 'Available',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    bedType: {
      type: String,
      default: '1 King Bed',
    },
    roomSize: {
      type: Number,
      default: 40, // sq meters
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast searching & filtering
roomSchema.index({ type: 1, pricePerNight: 1, capacity: 1, status: 1 });

module.exports = mongoose.model('Room', roomSchema);
