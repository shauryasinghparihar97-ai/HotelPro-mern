import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as roomService from '../services/roomService';
import * as bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import StarRating from '../components/common/StarRating';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [bookingForm, setBookingForm] = useState({
    checkIn: todayStr,
    checkOut: tomorrowStr,
    guests: '1',
    specialRequests: '',
  });

  const [nights, setNights] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await roomService.getRoomById(id);
        if (res.success && res.room) {
          setRoom(res.room);
          setActiveImage(res.room.images?.[0] || '');
          setTotalPrice(2 * res.room.pricePerNight);
        }
      } catch (err) {
        console.error('Failed to load room:', err);
        setError(err.response?.data?.message || 'Room could not be found');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Recalculate nights and total price whenever dates change
  useEffect(() => {
    if (bookingForm.checkIn && bookingForm.checkOut && room) {
      const start = new Date(bookingForm.checkIn);
      const end = new Date(bookingForm.checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * room.pricePerNight);
        setBookingError('');
      } else {
        setNights(0);
        setTotalPrice(0);
        setBookingError('Check-out date must be strictly after check-in date');
      }
    }
  }, [bookingForm.checkIn, bookingForm.checkOut, room]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate(`/login?redirect=/rooms/${id}`);
      return;
    }

    if (nights < 1) {
      setBookingError('Please select valid check-in and check-out dates (minimum 1 night)');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await bookingService.createBooking({
        roomId: room._id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: Number(bookingForm.guests),
        specialRequests: bookingForm.specialRequests,
      });

      if (res.success && res.booking) {
        navigate(`/booking/confirmation/${res.booking._id}`, {
          state: { booking: res.booking },
        });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(
        err.response?.data?.message || 'Could not complete booking. Please try another date.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving room details..." fullPage />;
  }

  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 max-w-lg mx-auto">
          <i className="bi bi-exclamation-octagon fs-1 text-danger mb-3"></i>
          <h3 className="fw-bold font-serif">Room Not Found</h3>
          <p className="text-muted">{error || 'The requested room could not be found.'}</p>
          <Link to="/rooms" className="btn btn-navy mt-3">
            Back to All Rooms
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxAmount;

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/rooms" className="text-decoration-none text-muted">Rooms & Suites</Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
              {room.title}
            </li>
          </ol>
        </nav>

        {/* Room Header Info */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-gold">{room.type}</span>
              <span className="badge bg-light text-secondary border">Room #{room.roomNumber}</span>
              <StarRating rating={room.rating || 4.8} />
            </div>
            <h1 className="display-6 fw-bold font-serif mb-1">{room.title}</h1>
            <p className="text-muted mb-0">
              <i className="bi bi-geo-alt-fill text-warning me-1"></i> HotelPro Grand Resort &bull; Coastal Wing
            </p>
          </div>

          <div className="text-md-end">
            <span className="text-muted small">Price per night</span>
            <div className="d-flex align-items-baseline gap-1">
              <span className="display-6 fw-bold font-serif" style={{ color: 'var(--hotel-navy)' }}>
                ${room.pricePerNight}
              </span>
              <span className="text-muted">/ night</span>
            </div>
          </div>
        </div>

        {/* Room Image Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '480px' }}>
              <img
                src={activeImage || room.images[0]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="d-flex flex-lg-column gap-3 h-100 overflow-auto">
              {room.images &&
                room.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3 overflow-hidden cursor-pointer border ${
                      activeImage === img ? 'border-primary border-3 shadow' : 'opacity-75'
                    }`}
                    style={{ height: '148px', cursor: 'pointer' }}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={img}
                      alt={`${room.title} thumbnail ${idx + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Details & Booking Form Split */}
        <div className="row g-5">
          {/* Left Column: Room Overview & Amenities */}
          <div className="col-lg-7">
            {/* Quick Specs Cards */}
            <div className="row g-3 mb-4">
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-people fs-4 text-warning mb-1 d-block"></i>
                  <span className="small text-muted d-block">Capacity</span>
                  <strong className="text-dark">Up to {room.capacity} Guests</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-moon-stars fs-4 text-warning mb-1 d-block"></i>
                  <span className="small text-muted d-block">Bed Configuration</span>
                  <strong className="text-dark">{room.bedType || '1 King Bed'}</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-aspect-ratio fs-4 text-warning mb-1 d-block"></i>
                  <span className="small text-muted d-block">Living Space</span>
                  <strong className="text-dark">{room.roomSize || 40} m²</strong>
                </div>
              </div>
            </div>

            {/* Room Description */}
            <div className="card border-0 bg-white rounded-4 shadow-sm p-4 mb-4">
              <h4 className="fw-bold font-serif mb-3">Suite Overview</h4>
              <p className="text-muted leading-relaxed mb-0" style={{ lineHeight: '1.8' }}>
                {room.description}
              </p>
            </div>

            {/* Room Amenities */}
            <div className="card border-0 bg-white rounded-4 shadow-sm p-4 mb-4">
              <h4 className="fw-bold font-serif mb-3">Suite Amenities & Privileges</h4>
              <div className="row g-3">
                {room.amenities &&
                  room.amenities.map((amenity, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-success fs-5"></i>
                        <span className="text-dark fw-medium">{amenity}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="card border-0 bg-white rounded-4 shadow-sm p-4">
              <h4 className="fw-bold font-serif mb-3">Check-In & Stay Policies</h4>
              <ul className="list-unstyled d-flex flex-column gap-2 text-muted small mb-0">
                <li className="d-flex gap-2">
                  <i className="bi bi-clock-history text-primary"></i>
                  <span><strong>Check-in:</strong> 3:00 PM onwards &bull; <strong>Check-out:</strong> 11:00 AM</span>
                </li>
                <li className="d-flex gap-2">
                  <i className="bi bi-arrow-repeat text-primary"></i>
                  <span><strong>Free Cancellation:</strong> Available up to the check-in day directly from your dashboard.</span>
                </li>
                <li className="d-flex gap-2">
                  <i className="bi bi-credit-card text-primary"></i>
                  <span><strong>Payment Terms:</strong> Reservation guarantee only. Payment is completed upon hotel check-in.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 p-4 sticky-top bg-white" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                  <span className="text-muted small">Reserve This Room</span>
                  <h4 className="fw-bold font-serif mb-0 text-navy">
                    ${room.pricePerNight} <small className="text-muted fs-6 fw-normal">/ night</small>
                  </h4>
                </div>
                <span className={`badge ${room.status === 'Available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {room.status}
                </span>
              </div>

              {bookingError && (
                <AlertMessage
                  variant="danger"
                  message={bookingError}
                  onClose={() => setBookingError('')}
                />
              )}

              <form onSubmit={handleBookingSubmit}>
                {/* Check In Date */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-calendar-event text-warning"></i> Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    className="form-control"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                  />
                </div>

                {/* Check Out Date */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-calendar-check text-warning"></i> Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={bookingForm.checkIn || todayStr}
                    className="form-control"
                    value={bookingForm.checkOut}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                  />
                </div>

                {/* Guests count */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-people text-warning"></i> Number of Guests (Max {room.capacity})
                  </label>
                  <select
                    className="form-select"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Special Requests (Optional)</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="e.g. Quiet floor, late arrival, feather pillows..."
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  ></textarea>
                </div>

                {/* Price Calculation Breakdown */}
                {nights > 0 && (
                  <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>${room.pricePerNight} &times; {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Resort Service Fee & Hospitality Tax (12%)</span>
                      <span>${taxAmount}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                      <span>Estimated Total</span>
                      <span className="text-primary">${grandTotal}</span>
                    </div>
                    <small className="text-muted d-block mt-2" style={{ fontSize: '0.75rem' }}>
                      * Calculated in real-time. No charge until arrival.
                    </small>
                  </div>
                )}

                {/* Reserve Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || nights < 1 || room.status === 'Maintenance'}
                  className="btn btn-gold btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Securing Reservation...</span>
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Sign In & Book Now</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i>
                      <span>Confirm & Book Suite</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
