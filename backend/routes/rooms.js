const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// GET /api/rooms — List all active rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true }).sort('roomNumber');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/rooms/availability?checkIn=...&checkOut=...&type=...
// Check room availability by date range and optional room type
router.get('/availability', async (req, res) => {
  try {
    const { checkIn, checkOut, type } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut dates are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // Find rooms with overlapping confirmed bookings
    const overlappingBookings = await Booking.find({
      status: 'confirmed',
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select('room');

    const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());

    // Build room query
    const roomQuery = {
      isActive: true,
      _id: { $nin: bookedRoomIds },
    };
    if (type && type !== 'All') {
      roomQuery.type = type;
    }

    const availableRooms = await Room.find(roomQuery).sort('type roomNumber');

    // Calculate total price for each room
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const results = availableRooms.map((room) => ({
      ...room.toObject(),
      nights,
      totalPrice: nights * room.pricePerNight,
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
