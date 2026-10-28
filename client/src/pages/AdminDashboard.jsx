import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import * as roomService from '../services/roomService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rooms' | 'bookings' | 'users'
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ variant: '', message: '' });

  // Room Form Modal State (Add or Edit)
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    description: '',
    pricePerNight: '',
    capacity: 2,
    bedType: '1 King Bed',
    roomSize: 45,
    status: 'Available',
    featured: false,
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: 'High-speed Wi-Fi, Air Conditioning, Flat-screen TV, Ensuite Bathroom, Ocean Balcony',
  });

  // Booking Filter State
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Initial Data Load
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        roomService.getRooms(),
        adminService.getAllBookings(),
        adminService.getAllUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentBookings(statsRes.recentBookings || []);
      }
      if (roomsRes.success) setRooms(roomsRes.rooms || []);
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to load administrator records.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Room Actions
  const handleOpenAddRoom = () => {
    setIsEditingRoom(false);
    setCurrentRoomId(null);
    setRoomForm({
      roomNumber: '',
      title: '',
      type: 'Deluxe',
      description: 'Experience utmost luxury and modern comfort.',
      pricePerNight: '250',
      capacity: 2,
      bedType: '1 King Bed',
      roomSize: 45,
      status: 'Available',
      featured: false,
      images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      amenities: 'High-speed Wi-Fi, Air Conditioning, Flat-screen TV, Ensuite Bathroom, Ocean Balcony',
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room) => {
    setIsEditingRoom(true);
    setCurrentRoomId(room._id);
    setRoomForm({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      description: room.description,
      pricePerNight: room.pricePerNight.toString(),
      capacity: room.capacity,
      bedType: room.bedType || '1 King Bed',
      roomSize: room.roomSize || 45,
      status: room.status,
      featured: !!room.featured,
      images: Array.isArray(room.images) ? room.images.join(', ') : '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const imagesArray = roomForm.images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean);
      const amenitiesArray = roomForm.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        roomNumber: roomForm.roomNumber.trim().toUpperCase(),
        title: roomForm.title.trim(),
        type: roomForm.type,
        description: roomForm.description.trim(),
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        bedType: roomForm.bedType,
        roomSize: Number(roomForm.roomSize),
        status: roomForm.status,
        featured: roomForm.featured,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
        amenities: amenitiesArray.length > 0 ? amenitiesArray : ['High-speed Wi-Fi'],
      };

      if (isEditingRoom) {
        const res = await roomService.updateRoom(currentRoomId, payload);
        if (res.success) {
          setFeedback({ variant: 'success', message: 'Room updated successfully!' });
          setRooms((prev) => prev.map((r) => (r._id === currentRoomId ? res.room : r)));
        }
      } else {
        const res = await roomService.createRoom(payload);
        if (res.success) {
          setFeedback({ variant: 'success', message: 'New room created successfully!' });
          setRooms((prev) => [res.room, ...prev]);
        }
      }

      setShowRoomModal(false);
      // Reload stats
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Room save failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Could not save room.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete Room ${roomNumber}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await roomService.deleteRoom(roomId);
      if (res.success) {
        setFeedback({ variant: 'success', message: `Room ${roomNumber} deleted successfully.` });
        setRooms((prev) => prev.filter((r) => r._id !== roomId));
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Delete room failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to delete room.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (bookingId, bookingStatus, paymentStatus) => {
    try {
      setActionLoading(true);
      const res = await adminService.updateBookingStatus(bookingId, {
        bookingStatus,
        paymentStatus,
      });

      if (res.success) {
        setFeedback({ variant: 'success', message: 'Booking status updated!' });
        setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.booking : b)));
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Update booking failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to update booking status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // User Role Action
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setFeedback({
          variant: 'success',
          message: `User role successfully updated to ${newRole}!`,
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Update user role failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Could not change user role.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'All' && b.bookingStatus !== bookingFilter) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      const userName = b.user?.name?.toLowerCase() || '';
      const userEmail = b.user?.email?.toLowerCase() || '';
      const roomNum = b.room?.roomNumber?.toLowerCase() || '';
      return userName.includes(q) || userEmail.includes(q) || roomNum.includes(q);
    }
    return true;
  });

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Admin Sidebar Navigation */}
        <div className="col-lg-2 col-md-3 admin-sidebar p-3 d-flex flex-column">
          <div className="px-3 py-3 border-bottom border-secondary border-opacity-25 mb-3">
            <span className="badge bg-warning text-dark mb-1">Admin Panel</span>
            <h5 className="font-serif fw-bold text-white mb-0">HotelPro Ops</h5>
          </div>

          <nav className="nav flex-column gap-1 flex-grow-1">
            <button
              className={`btn admin-nav-link text-start w-100 ${
                activeTab === 'overview' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 fs-5"></i>
              <span>Dashboard Overview</span>
            </button>

            <button
              className={`btn admin-nav-link text-start w-100 ${
                activeTab === 'rooms' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              <i className="bi bi-door-open fs-5"></i>
              <span>Rooms Management ({rooms.length})</span>
            </button>

            <button
              className={`btn admin-nav-link text-start w-100 ${
                activeTab === 'bookings' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="bi bi-calendar2-range fs-5"></i>
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              className={`btn admin-nav-link text-start w-100 ${
                activeTab === 'users' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people fs-5"></i>
              <span>Guest Directory ({users.length})</span>
            </button>
          </nav>

          <div className="p-3 border-top border-secondary border-opacity-25 text-white-50 small">
            <div>HotelPro PMS v1.0</div>
            <small>Connected: Local MongoDB</small>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-lg-10 col-md-9 p-4 bg-light min-vh-100">
          {/* Top Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border">
            <div>
              <h3 className="fw-bold font-serif mb-0 text-navy">
                {activeTab === 'overview' && 'Management Overview & Analytics'}
                {activeTab === 'rooms' && 'Suite & Room Inventory'}
                {activeTab === 'bookings' && 'Reservations & Front Desk'}
                {activeTab === 'users' && 'Registered Guests & Staff Directory'}
              </h3>
              <small className="text-muted">Real-time HotelPro administrative controls</small>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                title="Refresh records"
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
              {activeTab === 'rooms' && (
                <button
                  onClick={handleOpenAddRoom}
                  className="btn btn-gold btn-sm d-flex align-items-center gap-1 shadow-sm"
                >
                  <i className="bi bi-plus-lg"></i> Add New Room
                </button>
              )}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback.message && (
            <AlertMessage
              variant={feedback.variant}
              message={feedback.message}
              onClose={() => setFeedback({ variant: '', message: '' })}
            />
          )}

          {loading ? (
            <LoadingSpinner text="Retrieving administrative data..." fullPage />
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {/* Metric Cards Row */}
                  <div className="row g-3 mb-4">
                    {/* Total Revenue */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="card border-0 rounded-4 p-4 shadow-sm bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase">
                              Booking Revenue
                            </span>
                            <h3 className="fw-bold font-serif text-navy mt-2 mb-0">
                              ${stats?.totalRevenue?.toLocaleString() || 0}
                            </h3>
                          </div>
                          <div className="badge bg-success p-3 rounded-circle">
                            <i className="bi bi-cash-stack fs-4 text-white"></i>
                          </div>
                        </div>
                        <small className="text-muted mt-3 d-block">Confirmed & Completed stays</small>
                      </div>
                    </div>

                    {/* Total Rooms */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="card border-0 rounded-4 p-4 shadow-sm bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase">
                              Total Rooms
                            </span>
                            <h3 className="fw-bold font-serif text-navy mt-2 mb-0">
                              {stats?.totalRooms || 0}
                            </h3>
                          </div>
                          <div className="badge bg-primary p-3 rounded-circle">
                            <i className="bi bi-door-open fs-4 text-white"></i>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 small text-muted">
                          <span className="text-success fw-bold">{stats?.availableRooms || 0} Avail</span>
                          <span>&bull;</span>
                          <span className="text-warning fw-bold">{stats?.maintenanceRooms || 0} Maint</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="card border-0 rounded-4 p-4 shadow-sm bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase">
                              Total Bookings
                            </span>
                            <h3 className="fw-bold font-serif text-navy mt-2 mb-0">
                              {stats?.totalBookings || 0}
                            </h3>
                          </div>
                          <div className="badge bg-warning p-3 rounded-circle">
                            <i className="bi bi-calendar-check fs-4 text-dark"></i>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 small text-muted">
                          <span className="text-success fw-bold">{stats?.confirmedBookings || 0} Confirmed</span>
                          <span>&bull;</span>
                          <span className="text-danger fw-bold">{stats?.cancelledBookings || 0} Cancelled</span>
                        </div>
                      </div>
                    </div>

                    {/* Registered Guests */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="card border-0 rounded-4 p-4 shadow-sm bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase">
                              Registered Users
                            </span>
                            <h3 className="fw-bold font-serif text-navy mt-2 mb-0">
                              {stats?.totalUsers || 0}
                            </h3>
                          </div>
                          <div className="badge bg-info p-3 rounded-circle">
                            <i className="bi bi-people fs-4 text-white"></i>
                          </div>
                        </div>
                        <small className="text-muted mt-3 d-block">
                          Estimated Occupancy: <strong>{stats?.occupancyRate || 0}%</strong>
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold font-serif mb-0 text-navy">Recent Guest Bookings</h5>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="btn btn-sm btn-link text-decoration-none"
                      >
                        View All Bookings &rarr;
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover hotel-table align-middle">
                        <thead>
                          <tr>
                            <th>Guest</th>
                            <th>Suite</th>
                            <th>Check-In &bull; Out</th>
                            <th>Total Rate</th>
                            <th>Status</th>
                            <th>Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((b) => (
                            <tr key={b._id}>
                              <td>
                                <strong className="text-dark">{b.user?.name || 'Guest'}</strong>
                                <small className="text-muted d-block">{b.user?.email}</small>
                              </td>
                              <td>
                                <div>Room #{b.room?.roomNumber}</div>
                                <small className="text-muted">{b.room?.title}</small>
                              </td>
                              <td>
                                <small className="fw-semibold">
                                  {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                                </small>
                                <small className="d-block text-muted">{b.nights} night(s)</small>
                              </td>
                              <td>
                                <span className="fw-bold font-serif text-navy">${b.totalPrice}</span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    b.bookingStatus === 'Confirmed'
                                      ? 'bg-success'
                                      : b.bookingStatus === 'Cancelled'
                                      ? 'bg-danger'
                                      : 'bg-warning text-dark'
                                  }`}
                                >
                                  {b.bookingStatus}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    b.paymentStatus === 'Paid'
                                      ? 'bg-success'
                                      : b.paymentStatus === 'Refunded'
                                      ? 'bg-secondary'
                                      : 'bg-light text-dark border'
                                  }`}
                                >
                                  {b.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ROOMS MANAGEMENT */}
              {activeTab === 'rooms' && (
                <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold font-serif mb-0 text-navy">All Room Inventory ({rooms.length})</h5>
                    <button onClick={handleOpenAddRoom} className="btn btn-gold btn-sm shadow-sm">
                      <i className="bi bi-plus-lg me-1"></i> Add Room
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover hotel-table align-middle">
                      <thead>
                        <tr>
                          <th>Room</th>
                          <th>Title & Description</th>
                          <th>Type</th>
                          <th>Capacity</th>
                          <th>Rate / Night</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={
                                    room.images?.[0] ||
                                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                                  }
                                  alt={room.title}
                                  className="rounded-3 object-fit-cover shadow-sm"
                                  style={{ width: '60px', height: '48px' }}
                                />
                                <strong className="font-monospace text-primary">#{room.roomNumber}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold text-dark">{room.title}</div>
                              <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
                                {room.description}
                              </small>
                            </td>
                            <td>
                              <span className="badge badge-gold">{room.type}</span>
                            </td>
                            <td>
                              <small className="fw-semibold">{room.capacity} Guests</small>
                              <small className="text-muted d-block">{room.bedType}</small>
                            </td>
                            <td>
                              <strong className="text-navy font-serif fs-6">${room.pricePerNight}</strong>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  room.status === 'Available'
                                    ? 'bg-success'
                                    : room.status === 'Maintenance'
                                    ? 'bg-warning text-dark'
                                    : 'bg-secondary'
                                }`}
                              >
                                {room.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  onClick={() => handleOpenEditRoom(room)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit Room"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete Room"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKINGS MANAGEMENT */}
              {activeTab === 'bookings' && (
                <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
                  {/* Filters Bar */}
                  <div className="row g-3 mb-4 align-items-center">
                    <div className="col-md-4">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search guest, email, room..."
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="btn-group btn-group-sm w-100" role="group">
                        {['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            className={`btn ${bookingFilter === st ? 'btn-navy' : 'btn-outline-secondary'}`}
                            onClick={() => setBookingFilter(st)}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end text-muted small">
                      Total Bookings: <strong>{filteredBookings.length}</strong>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover hotel-table align-middle">
                      <thead>
                        <tr>
                          <th>Guest Details</th>
                          <th>Room</th>
                          <th>Stay Range</th>
                          <th>Total Price</th>
                          <th>Booking Status</th>
                          <th>Payment Status</th>
                          <th className="text-end">Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => (
                          <tr key={b._id}>
                            <td>
                              <strong className="text-dark">{b.user?.name || 'Guest'}</strong>
                              <small className="text-muted d-block">{b.user?.email}</small>
                              <small className="text-muted">{b.user?.phone || 'No phone'}</small>
                            </td>
                            <td>
                              <strong>Room #{b.room?.roomNumber}</strong>
                              <small className="text-muted d-block">{b.room?.type}</small>
                            </td>
                            <td>
                              <small className="fw-semibold">
                                {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                              </small>
                              <small className="text-muted d-block">
                                {b.nights} night(s) &bull; {b.guests} guest(s)
                              </small>
                            </td>
                            <td>
                              <span className="fw-bold font-serif fs-6 text-navy">
                                ${b.totalPrice}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={b.bookingStatus}
                                onChange={(e) =>
                                  handleUpdateBookingStatus(b._id, e.target.value, b.paymentStatus)
                                }
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={b.paymentStatus}
                                onChange={(e) =>
                                  handleUpdateBookingStatus(b._id, b.bookingStatus, e.target.value)
                                }
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-light text-secondary border">
                                ID: ...{b._id.slice(-6)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: USERS MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
                  <h5 className="fw-bold font-serif mb-4 text-navy">Guest & Staff Directory ({users.length})</h5>

                  <div className="table-responsive">
                    <table className="table table-hover hotel-table align-middle">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Phone</th>
                          <th>Joined</th>
                          <th>Total Bookings</th>
                          <th>Total Spent</th>
                          <th className="text-end">Role Privilege</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="fw-bold text-dark">{u.name}</div>
                              <small className="text-muted">{u.email}</small>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  u.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="small">{u.phone || 'N/A'}</td>
                            <td className="small text-muted">{formatDate(u.createdAt)}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {u.bookingCount || 0} reservation(s)
                              </span>
                            </td>
                            <td>
                              <strong className="text-navy font-serif">
                                ${u.totalSpent ? u.totalSpent.toLocaleString() : 0}
                              </strong>
                            </td>
                            <td className="text-end">
                              <button
                                disabled={actionLoading}
                                onClick={() => handleToggleUserRole(u._id, u.role)}
                                className={`btn btn-sm ${
                                  u.role === 'admin'
                                    ? 'btn-outline-danger'
                                    : 'btn-outline-warning'
                                }`}
                              >
                                {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ADD / EDIT ROOM MODAL */}
      {showRoomModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-navy text-white py-3 px-4" style={{ background: 'var(--hotel-navy)' }}>
                <h5 className="modal-title font-serif text-white">
                  {isEditingRoom ? 'Edit Suite Specifications' : 'Add New Luxury Suite'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRoomModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveRoom}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Number *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. 401"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Suite Title *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Sapphire Horizon Deluxe Suite"
                        value={roomForm.title}
                        onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Type *</label>
                      <select
                        className="form-select"
                        value={roomForm.type}
                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price Per Night ($) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-control"
                        value={roomForm.pricePerNight}
                        onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Max Capacity (Guests) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="10"
                        className="form-control"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Bed Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1 King Bed"
                        value={roomForm.bedType}
                        onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Size (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="45"
                        value={roomForm.roomSize}
                        onChange={(e) => setRoomForm({ ...roomForm, roomSize: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Status</label>
                      <select
                        className="form-select"
                        value={roomForm.status}
                        onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        rows="3"
                        required
                        className="form-control"
                        placeholder="Describe the aesthetic, comforts, view, and unique aspects..."
                        value={roomForm.description}
                        onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Image URLs (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://image1.jpg, https://image2.jpg"
                        value={roomForm.images}
                        onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                      />
                      <small className="text-muted">Separate multiple image URLs with commas</small>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Amenities (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="High-speed Wi-Fi, Ocean Balcony, Rainfall Shower, Mini Bar"
                        value={roomForm.amenities}
                        onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featuredCheck"
                          checked={roomForm.featured}
                          onChange={(e) => setRoomForm({ ...roomForm, featured: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="featuredCheck">
                          Feature this suite prominently on the Home Page
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowRoomModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn btn-navy px-4 fw-semibold"
                  >
                    {actionLoading ? 'Saving Suite...' : 'Save Suite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
