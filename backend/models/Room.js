const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Single', 'Double', 'Suite', 'Deluxe'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0,
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Max occupancy is required'],
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
