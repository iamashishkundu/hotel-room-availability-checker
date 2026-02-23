const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// GET /api/bookings — List all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/bookings/:id — Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/bookings — Create a booking
router.post(
  '/',
  [
    body('guestName').trim().notEmpty().withMessage('Guest name is required'),
    body('guestEmail').isEmail().withMessage('Valid email is required'),
    body('roomId').notEmpty().withMessage('Room ID is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { guestName, guestEmail, roomId, checkIn, checkOut } = req.body;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ message: 'Check-out must be after check-in' });
      }

      // Verify room exists and is active
      const room = await Room.findById(roomId);
      if (!room || !room.isActive) {
        return res.status(404).json({ message: 'Room not found or inactive' });
      }

      // Re-validate availability server-side to prevent double-bookings
      const overlapping = await Booking.findOne({
        room: roomId,
        status: 'confirmed',
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate },
      });

      if (overlapping) {
        return res.status(409).json({
          message: 'Room is no longer available for the selected dates. Please choose different dates or another room.',
        });
      }

      // Calculate total price
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );

      const booking = new Booking({
        guestName,
        guestEmail,
        room: roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: nights * room.pricePerNight,
        status: 'confirmed',
      });

      await booking.save();
      await booking.populate('room');

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// PATCH /api/bookings/:id/cancel — Cancel a booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
