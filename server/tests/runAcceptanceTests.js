process.env.NODE_ENV = 'test';
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../server');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { connectDB } = require('../config/db');

async function runTests() {
  console.log('====================================================');
  console.log('   HOTELPRO AUTOMATED BACKEND ACCEPTANCE TESTS      ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title, details = '') => {
    if (condition) {
      console.log(`  [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${title} ${details ? '- ' + JSON.stringify(details) : ''}`);
      failed++;
    }
  };

  try {
    // 1. Database Connection Check
    await connectDB();
    assert(mongoose.connection.readyState === 1, 'Criteria 2: MongoDB connects successfully when configured');

    // Health check endpoint
    const healthRes = await request(app).get('/api/health');
    assert(healthRes.status === 200 && healthRes.body.success === true, 'Criteria 1: Server starts and health check returns 200');

    // 2. Authentication: Registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Test Traveler',
      email: testEmail,
      password: 'StrongPassword123!',
      phone: '+1 555-900-1122',
    });
    assert(regRes.status === 201 && regRes.body.token && regRes.body.user.role === 'customer', 'Criteria 3a: A user can register with hashed password & JWT returned', regRes.body);
    assert(!regRes.body.user.password, 'Security Check: Passwords or hashes are never exposed in responses');

    // 3. Authentication: Login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });
    assert(loginRes.status === 200 && loginRes.body.token, 'Criteria 3b: A registered user can log in', loginRes.body);
    const customerToken = loginRes.body.token;

    // Login with invalid credentials should fail
    const badLoginRes = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword!',
    });
    assert(badLoginRes.status === 401, 'Criteria 3c: Invalid login credentials are rejected with 401');

    // 4. Protected Routes Check
    const unauthRes = await request(app).get('/api/bookings/my-bookings');
    assert(unauthRes.status === 401, 'Criteria 4: Protected routes reject unauthenticated requests');

    // 5. Role Authorization: Customer cannot access Admin endpoints
    const customerAdminRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${customerToken}`);
    assert(customerAdminRes.status === 403, 'Criteria 5: Customers cannot access administrator functions (403 Forbidden)');

    // Login as Admin
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@hotelpro.com',
      password: 'AdminPassword123!',
    });
    assert(adminLogin.status === 200 && adminLogin.body.user.role === 'admin', 'Criteria 5b: Admin login succeeds with admin role');
    const adminToken = adminLogin.body.token;

    // Admin can access admin stats
    const adminStats = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(adminStats.status === 200 && typeof adminStats.body.stats.totalRooms === 'number', 'Criteria 11a: Admin can access dashboard statistics');

    // 6. Rooms Listing and Filtering
    const roomsRes = await request(app).get('/api/rooms');
    assert(roomsRes.status === 200 && roomsRes.body.rooms.length > 0, 'Criteria 6: Rooms can be listed publicly');
    const sampleRoom = roomsRes.body.rooms[0];

    // 7. Booking Creation with Valid Dates
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 10);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 3);

    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests: 1, // Room capacity safe
        specialRequests: 'Quiet room on upper floor',
      });

    assert(bookingRes.status === 201 && bookingRes.body.booking && bookingRes.body.booking.nights === 3, 'Criteria 7: A booking can be created with valid dates', bookingRes.body);
    const bookingId = bookingRes.body.booking._id;

    // Price verification: server calculated price
    const expectedPrice = 3 * sampleRoom.pricePerNight;
    assert(bookingRes.body.booking.totalPrice === expectedPrice, 'Criteria 7b: Server accurately calculates nights and total price from database room rate');

    // 8. Overlapping bookings for same room are rejected!
    const overlapIn = new Date(checkIn);
    overlapIn.setDate(checkIn.getDate() + 1);
    const overlapOut = new Date(checkIn);
    overlapOut.setDate(checkIn.getDate() + 4);

    const overlapRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: overlapIn.toISOString().split('T')[0],
        checkOut: overlapOut.toISOString().split('T')[0],
        guests: 1,
      });

    assert(overlapRes.status === 409, 'Criteria 8: Overlapping booking for the same room is rejected with 409 Conflict');

    // 9. Invalid Dates and Input Rejected
    // Past check-in
    const pastIn = new Date(today);
    pastIn.setDate(today.getDate() - 5);
    const pastOut = new Date(today);
    pastOut.setDate(today.getDate() - 2);

    const pastRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: pastIn.toISOString().split('T')[0],
        checkOut: pastOut.toISOString().split('T')[0],
        guests: 1,
      });
    assert(pastRes.status === 400, 'Criteria 9a: Past check-in dates are rejected with 400');

    // Check-out before check-in
    const invertedRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: checkOut.toISOString().split('T')[0],
        checkOut: checkIn.toISOString().split('T')[0],
        guests: 1,
      });
    assert(invertedRes.status === 400, 'Criteria 9b: Check-out before check-in is rejected with 400');

    // Exceeding room capacity
    const capacityRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests: sampleRoom.capacity + 10,
      });
    assert(capacityRes.status === 400, 'Criteria 9c: Exceeding room guest capacity is rejected with 400');

    // 10. Isolation: Customer can only view their own bookings
    const otherUserRes = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: `other_${Date.now()}@example.com`,
      password: 'OtherPassword123!',
    });
    const otherToken = otherUserRes.body.token;

    const crossAccessRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    assert(crossAccessRes.status === 403, 'Criteria 10: Customers cannot access another customer\'s booking details (403 Forbidden)');

    // Owner can access their own booking
    const ownerAccessRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    assert(ownerAccessRes.status === 200, 'Criteria 10b: Owner can access their own booking');

    // 11. Admin Room Management (Create, Update, Delete)
    const newRoomNum = `TEST-${Date.now().toString().slice(-4)}`;
    const createRoomRes = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        roomNumber: newRoomNum,
        title: 'VIP Test Suite',
        type: 'Suite',
        description: 'Exclusive suite for testing verification.',
        pricePerNight: 450,
        capacity: 3,
        amenities: ['Jacuzzi', 'Ocean View', 'Wi-Fi'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
      });
    assert(createRoomRes.status === 201, 'Criteria 11b: Admin can create a new room');
    const createdRoomId = createRoomRes.body.room._id;

    // Admin updates the room
    const updateRoomRes = await request(app)
      .put(`/api/rooms/${createdRoomId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ pricePerNight: 499 });
    assert(updateRoomRes.status === 200 && updateRoomRes.body.room.pricePerNight === 499, 'Criteria 11c: Admin can update room details');

    // Admin deletes the room
    const deleteRoomRes = await request(app)
      .delete(`/api/rooms/${createdRoomId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert(deleteRoomRes.status === 200, 'Criteria 11d: Admin can delete a room without active bookings');

    // 12. Booking Cancellation
    const cancelRes = await request(app)
      .put(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);
    assert(cancelRes.status === 200 && cancelRes.body.booking.bookingStatus === 'Cancelled', 'Criteria 12: Customer can cancel eligible booking and status updates to Cancelled');

    // After cancellation, the room becomes available again for those dates!
    const rebookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        roomId: sampleRoom._id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests: 1,
      });
    assert(rebookRes.status === 201, 'Criteria 12b: Room availability is restored after booking cancellation');

    // Clean up created test booking & users
    if (rebookRes.body.booking) {
      await Booking.findByIdAndDelete(rebookRes.body.booking._id);
    }
    await Booking.findByIdAndDelete(bookingId);
    await User.findByIdAndDelete(regRes.body.user._id);
    await User.findByIdAndDelete(otherUserRes.body.user._id);

    console.log('\n====================================================');
    console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Unhandled test error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

runTests();
