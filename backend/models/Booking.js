const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Auto-calculate totalPrice before saving
bookingSchema.pre('validate', async function (next) {
  if (this.checkIn && this.checkOut && this.room) {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.room);
    if (room) {
      const nights = Math.ceil(
        (new Date(this.checkOut) - new Date(this.checkIn)) / (1000 * 60 * 60 * 24)
      );
      this.totalPrice = nights * room.pricePerNight;
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
