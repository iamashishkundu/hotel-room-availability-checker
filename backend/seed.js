require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

const rooms = [
  // Singles (3)
  { roomNumber: '101', type: 'Single', pricePerNight: 80, maxOccupancy: 1, amenities: ['Wi-Fi', 'TV', 'Air Conditioning'], isActive: true },
  { roomNumber: '102', type: 'Single', pricePerNight: 85, maxOccupancy: 1, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'], isActive: true },
  { roomNumber: '103', type: 'Single', pricePerNight: 90, maxOccupancy: 1, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Work Desk'], isActive: true },
  // Doubles (3)
  { roomNumber: '201', type: 'Double', pricePerNight: 130, maxOccupancy: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'], isActive: true },
  { roomNumber: '202', type: 'Double', pricePerNight: 140, maxOccupancy: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Coffee Maker', 'Mini Fridge'], isActive: true },
  { roomNumber: '203', type: 'Double', pricePerNight: 135, maxOccupancy: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Balcony'], isActive: true },
  // Suites (3)
  { roomNumber: '301', type: 'Suite', pricePerNight: 250, maxOccupancy: 4, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Balcony'], isActive: true },
  { roomNumber: '302', type: 'Suite', pricePerNight: 275, maxOccupancy: 4, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Jacuzzi'], isActive: true },
  { roomNumber: '303', type: 'Suite', pricePerNight: 260, maxOccupancy: 3, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area'], isActive: true },
  // Deluxe (3)
  { roomNumber: '401', type: 'Deluxe', pricePerNight: 350, maxOccupancy: 3, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Ocean View', 'Butler Service'], isActive: true },
  { roomNumber: '402', type: 'Deluxe', pricePerNight: 380, maxOccupancy: 4, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Ocean View', 'Butler Service', 'Private Pool'], isActive: true },
  { roomNumber: '403', type: 'Deluxe', pricePerNight: 360, maxOccupancy: 3, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Mountain View', 'Butler Service'], isActive: true },
];

// Helper to create date offset from today
function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(14, 0, 0, 0); // Check-in at 2 PM
  return d;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing rooms and bookings');

    // Insert rooms
    const insertedRooms = await Room.insertMany(rooms);
    console.log(`Inserted ${insertedRooms.length} rooms`);

    // Create a map by room number for easy reference
    const roomMap = {};
    insertedRooms.forEach((r) => {
      roomMap[r.roomNumber] = r;
    });

    // Pre-existing bookings (6 bookings spread across next 30 days)
    const bookingsData = [
      {
        guestName: 'Alice Johnson',
        guestEmail: 'alice@example.com',
        room: roomMap['101']._id,
        checkIn: futureDate(2),
        checkOut: futureDate(5),
      },
      {
        guestName: 'Bob Smith',
        guestEmail: 'bob@example.com',
        room: roomMap['201']._id,
        checkIn: futureDate(1),
        checkOut: futureDate(4),
      },
      {
        guestName: 'Carol Davis',
        guestEmail: 'carol@example.com',
        room: roomMap['301']._id,
        checkIn: futureDate(7),
        checkOut: futureDate(10),
      },
      {
        guestName: 'Daniel Lee',
        guestEmail: 'daniel@example.com',
        room: roomMap['401']._id,
        checkIn: futureDate(5),
        checkOut: futureDate(8),
      },
      {
        guestName: 'Emma Wilson',
        guestEmail: 'emma@example.com',
        room: roomMap['202']._id,
        checkIn: futureDate(15),
        checkOut: futureDate(20),
      },
      {
        guestName: 'Frank Garcia',
        guestEmail: 'frank@example.com',
        room: roomMap['102']._id,
        checkIn: futureDate(10),
        checkOut: futureDate(13),
      },
    ];

    for (const data of bookingsData) {
      const nights = Math.ceil(
        (data.checkOut - data.checkIn) / (1000 * 60 * 60 * 24)
      );
      const room = await Room.findById(data.room);
      const booking = new Booking({
        ...data,
        totalPrice: nights * room.pricePerNight,
        status: 'confirmed',
      });
      await booking.save();
    }

    console.log(`Inserted ${bookingsData.length} bookings`);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
