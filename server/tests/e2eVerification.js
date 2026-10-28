const BASE_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }

  return { status: res.status, ok: res.ok, data };
}

async function runE2E() {
  console.log('====================================================');
  console.log('   HOTELPRO LIVE END-TO-END FLOW VERIFICATION       ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error('       Error:', err.message);
      failed++;
    }
  }

  // 1. Health & Database check
  await test('1. API Health & MongoDB Connection', async () => {
    const res = await req('/health');
    if (!res.ok || res.data.database.status !== 'Connected') {
      throw new Error('Database is not connected');
    }
  });

  // 2. Room Browsing
  let selectedRoom = null;
  await test('2. Room Browsing & Public Filter', async () => {
    const res = await req('/rooms?type=Deluxe');
    if (!res.ok || !res.data.rooms || res.data.rooms.length === 0) {
      throw new Error('No rooms returned');
    }
    selectedRoom = res.data.rooms[0];
  });

  // 3. User Registration
  const uniqueEmail = `guest_${Date.now()}@test.com`;
  let customerToken = null;

  await test('3. New Customer Registration', async () => {
    const res = await req('/auth/register', {
      method: 'POST',
      body: {
        name: 'Jessica Parker',
        email: uniqueEmail,
        password: 'SecurePassword123!',
        phone: '+1 555-432-8765',
      },
    });
    if (res.status !== 201 || !res.data.token || res.data.user.role !== 'customer') {
      throw new Error(res.data.message || 'Registration failed');
    }
    customerToken = res.data.token;
  });

  // 4. Customer Login
  await test('4. Customer Authentication & Login', async () => {
    const res = await req('/auth/login', {
      method: 'POST',
      body: {
        email: uniqueEmail,
        password: 'SecurePassword123!',
      },
    });
    if (res.status !== 200 || !res.data.token) {
      throw new Error(res.data.message || 'Login failed');
    }
    customerToken = res.data.token;
  });

  // 5. Booking Creation
  let bookingId = null;
  const inDate = new Date();
  inDate.setDate(inDate.getDate() + 15);
  const outDate = new Date(inDate);
  outDate.setDate(inDate.getDate() + 4);

  const checkInStr = inDate.toISOString().split('T')[0];
  const checkOutStr = outDate.toISOString().split('T')[0];

  await test('5. Booking Creation with Real-Time Pricing', async () => {
    const res = await req('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        roomId: selectedRoom._id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: 2,
        specialRequests: 'Ocean view suite please',
      },
    });
    if (res.status !== 201 || !res.data.booking) {
      throw new Error(res.data.message || 'Booking failed');
    }
    bookingId = res.data.booking._id;
    const expectedNights = 4;
    const expectedTotal = expectedNights * selectedRoom.pricePerNight;
    if (res.data.booking.totalPrice !== expectedTotal) {
      throw new Error(`Price mismatch: got ${res.data.booking.totalPrice}, expected ${expectedTotal}`);
    }
  });

  // 6. Overlapping Booking Prevention
  await test('6. Overlap Prevention (409 Conflict)', async () => {
    const res = await req('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        roomId: selectedRoom._id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: 2,
      },
    });
    if (res.status !== 409) {
      throw new Error(`Expected status 409 Conflict, received ${res.status}`);
    }
  });

  // 7. Customer Booking History
  await test('7. Customer Booking History in Portal', async () => {
    const res = await req('/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (!res.ok || res.data.bookings.length === 0) {
      throw new Error('No bookings found in customer history');
    }
    const found = res.data.bookings.find((b) => b._id === bookingId);
    if (!found) throw new Error('Newly created booking not in customer history');
  });

  // 8. Booking Cancellation
  await test('8. Booking Cancellation by Customer', async () => {
    const res = await req(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (!res.ok || res.data.booking.bookingStatus !== 'Cancelled') {
      throw new Error(res.data.message || 'Cancellation status not updated');
    }
  });

  // 9. Admin Access & Management
  let adminToken = null;
  await test('9. Administrator Login & Analytics Access', async () => {
    const res = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@hotelpro.com',
        password: 'AdminPassword123!',
      },
    });
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'admin') {
      throw new Error(res.data.message || 'Admin login failed');
    }
    adminToken = res.data.token;

    const statsRes = await req('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!statsRes.ok || typeof statsRes.data.stats.totalRooms !== 'number') {
      throw new Error('Failed to retrieve admin stats');
    }
  });

  // 10. Admin Room & Booking Management
  await test('10. Admin Room & Booking Status Updates', async () => {
    const updateRes = await req(`/admin/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { bookingStatus: 'Completed', paymentStatus: 'Paid' },
    });
    if (!updateRes.ok || updateRes.data.booking.bookingStatus !== 'Completed') {
      throw new Error(updateRes.data.message || 'Admin booking update failed');
    }
  });

  console.log('\n====================================================');
  console.log(`   E2E RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runE2E();
