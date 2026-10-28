const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { connectDB } = require('../config/db');

const initialUsers = [
  {
    name: 'Alexander Wright',
    email: 'admin@hotelpro.com',
    password: 'AdminPassword123!',
    role: 'admin',
    phone: '+1 (555) 019-2834',
  },
  {
    name: 'Sophia Montgomery',
    email: 'customer@hotelpro.com',
    password: 'CustomerPassword123!',
    role: 'customer',
    phone: '+1 (555) 438-9120',
  },
  {
    name: 'David Chen',
    email: 'david.chen@example.com',
    password: 'CustomerPassword123!',
    role: 'customer',
    phone: '+1 (555) 782-3490',
  },
];

const initialRooms = [
  {
    roomNumber: '101',
    title: 'Deluxe Oceanfront Suite',
    type: 'Deluxe',
    description: 'Immerse yourself in coastal elegance. Features panoramic ocean views from a private balcony, a lavish marble bathroom with a deep soaking tub, and custom Italian linens.',
    pricePerNight: 280,
    capacity: 2,
    bedType: '1 Plush King Bed',
    roomSize: 55,
    rating: 4.9,
    featured: true,
    status: 'Available',
    amenities: [
      'High-speed Wi-Fi',
      'Private Ocean Balcony',
      'Marble Soaking Tub',
      'Nespresso Coffee Machine',
      'Mini Bar & Wine Cooler',
      'Smart 4K TV & Soundbar',
      '24/7 Room Service',
      'Air Conditioning',
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '201',
    title: 'The Grand Presidential Penthouse',
    type: 'Presidential',
    description: 'The pinnacle of luxury hospitality. This sprawling penthouse suite features a private terrace with heated jacuzzi, private butler service, bespoke chandelier lighting, and a chef-ready dining salon.',
    pricePerNight: 750,
    capacity: 4,
    bedType: '2 California King Beds',
    roomSize: 135,
    rating: 5.0,
    featured: true,
    status: 'Available',
    amenities: [
      'Private Terrace & Heated Jacuzzi',
      'Dedicated Butler Service',
      'Private Dining Salon & Bar',
      'High-speed Wi-Fi',
      'Walk-in Dressing Room',
      'Smart Home Automation',
      'Bang & Olufsen Sound System',
      'Complimentary Airport Chauffeur',
    ],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '301',
    title: 'Executive Skyline Suite',
    type: 'Suite',
    description: 'Designed for discerning travelers and executives. Features a separate work study with ergonomic seating, city skyline vistas, rainfall shower, and complimentary access to the Executive Club Lounge.',
    pricePerNight: 390,
    capacity: 3,
    bedType: '1 King Bed & 1 Daybed',
    roomSize: 70,
    rating: 4.8,
    featured: true,
    status: 'Available',
    amenities: [
      'Club Lounge Access',
      'Dedicated Workstation & Ergonomic Chair',
      'Rainfall Shower & Steam Sauna',
      'High-speed Wi-Fi',
      'Espresso & Tea Bar',
      'In-Room Safe & Pressing Service',
      'Air Conditioning',
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '102',
    title: 'Classic Garden Double Room',
    type: 'Double',
    description: 'Charming and serene, this double room looks out onto our fragrant botanical courtyard. Equipped with two queen beds, soundproofing, and organic bath essentials.',
    pricePerNight: 195,
    capacity: 4,
    bedType: '2 Queen Beds',
    roomSize: 45,
    rating: 4.7,
    featured: false,
    status: 'Available',
    amenities: [
      'Courtyard Garden View',
      'Two Plush Queen Beds',
      'High-speed Wi-Fi',
      'Soundproof Windows',
      'Artisanal Bath Amenities',
      'HD Smart TV',
      'Tea & Coffee Maker',
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '103',
    title: 'Boutique Solo Traveler Sanctuary',
    type: 'Single',
    description: 'An artfully curated sanctuary tailored for the solo explorer or focused business professional. High-thread-count linens, ultra-fast fiber internet, and sleek contemporary decor.',
    pricePerNight: 130,
    capacity: 1,
    bedType: '1 Queen Bed',
    roomSize: 32,
    rating: 4.6,
    featured: false,
    status: 'Available',
    amenities: [
      'High-speed Fiber Wi-Fi',
      'Dedicated Laptop Desk',
      'Rainfall Shower',
      'Smart TV with Streaming Apps',
      'Air Conditioning',
      'Electronic Safe',
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '202',
    title: 'Royal Heritage Deluxe Suite',
    type: 'Deluxe',
    description: 'Blending historic architecture with contemporary opulence. Features ornate crown molding, handcrafted walnut furnishings, and a luxurious double vanity bathroom.',
    pricePerNight: 320,
    capacity: 2,
    bedType: '1 King Bed',
    roomSize: 62,
    rating: 4.9,
    featured: true,
    status: 'Available',
    amenities: [
      'Historic Courtyard Views',
      'Double Marble Vanity',
      'Complimentary Champagne Welcome',
      'High-speed Wi-Fi',
      'Deep Soaking Tub',
      'Designer Bathrobes & Slippers',
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('[Seed] Connecting to MongoDB...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing bookings, rooms, and users...');
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Seeding default users...');
    // Use User.create so pre('save') bcrypt hashing is properly executed
    const createdUsers = [];
    for (const u of initialUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] Seeded ${createdUsers.length} users:`);
    console.log(`   - Admin: admin@hotelpro.com (Password: AdminPassword123!)`);
    console.log(`   - Customer: customer@hotelpro.com (Password: CustomerPassword123!)`);

    console.log('[Seed] Seeding rooms...');
    const createdRooms = await Room.insertMany(initialRooms);
    console.log(`[Seed] Seeded ${createdRooms.length} luxury hotel rooms.`);

    console.log('[Seed] Seeding sample initial booking for demonstration...');
    const customer = createdUsers.find((u) => u.role === 'customer');
    const demoRoom = createdRooms[0];

    // Create a confirmed booking 5 days in the future
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 5);
    checkInDate.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    const nights = 3;
    const totalPrice = nights * demoRoom.pricePerNight;

    await Booking.create({
      user: customer._id,
      room: demoRoom._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: 2,
      nights,
      pricePerNight: demoRoom.pricePerNight,
      totalPrice,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'High floor preferred. Anniversary celebration.',
    });
    console.log(`[Seed] Seeded sample booking for ${customer.name} in Room ${demoRoom.roomNumber}.`);

    console.log('[Seed] Database successfully seeded with HotelPro demo data!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

// If run directly via `node utils/seedData.js`
if (require.main === module) {
  seedData();
}

module.exports = { seedData, initialUsers, initialRooms };
