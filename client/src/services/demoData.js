export const initialDemoRooms = [
  {
    _id: 'room-101',
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
    _id: 'room-201',
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
    _id: 'room-301',
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
    _id: 'room-102',
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
    _id: 'room-103',
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
    _id: 'room-202',
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

export const demoAccounts = {
  customer: {
    _id: 'user-customer-demo',
    name: 'Sophia Montgomery',
    email: 'customer@hotelpro.com',
    role: 'customer',
    phone: '+1 (555) 438-9120',
  },
  admin: {
    _id: 'user-admin-demo',
    name: 'Alexander Wright',
    email: 'admin@hotelpro.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
  },
};

export const getStoredRooms = () => {
  const stored = localStorage.getItem('hotelpro_demo_rooms');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem('hotelpro_demo_rooms', JSON.stringify(initialDemoRooms));
  return initialDemoRooms;
};

export const saveStoredRooms = (rooms) => {
  localStorage.setItem('hotelpro_demo_rooms', JSON.stringify(rooms));
};

export const getStoredBookings = () => {
  const stored = localStorage.getItem('hotelpro_demo_bookings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }

  // Initial demo booking for customer
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 3);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);

  const initialBookings = [
    {
      _id: 'booking-demo-1',
      bookingReference: 'HP-DEMO8921',
      user: demoAccounts.customer,
      room: initialDemoRooms[0],
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests: 2,
      nights: 2,
      pricePerNight: initialDemoRooms[0].pricePerNight,
      totalPrice: initialDemoRooms[0].pricePerNight * 2,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'High floor preferred with ocean view.',
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem('hotelpro_demo_bookings', JSON.stringify(initialBookings));
  return initialBookings;
};

export const saveStoredBookings = (bookings) => {
  localStorage.setItem('hotelpro_demo_bookings', JSON.stringify(bookings));
};

export const addDemoBooking = (bookingData, currentUser) => {
  const bookings = getStoredBookings();
  const rooms = getStoredRooms();
  const room = rooms.find((r) => r._id === bookingData.roomId) || rooms[0];

  const checkInDate = new Date(bookingData.checkIn);
  const checkOutDate = new Date(bookingData.checkOut);
  const diffTime = Math.abs(checkOutDate - checkInDate);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = nights * room.pricePerNight;
  const refCode = 'HP-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newBooking = {
    _id: 'booking-' + Date.now(),
    bookingReference: refCode,
    user: currentUser || demoAccounts.customer,
    room,
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    guests: bookingData.guests || 1,
    nights,
    pricePerNight: room.pricePerNight,
    totalPrice,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: bookingData.specialRequests || '',
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  saveStoredBookings(bookings);
  return newBooking;
};

export const cancelDemoBooking = (bookingId) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b._id === bookingId);
  if (index !== -1) {
    bookings[index].bookingStatus = 'Cancelled';
    saveStoredBookings(bookings);
    return bookings[index];
  }
  return null;
};
