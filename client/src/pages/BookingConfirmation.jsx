import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import * as bookingService from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingService.getBookingById(id);
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
          setError(err.response?.data?.message || 'Could not load booking details');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving reservation details..." fullPage />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 max-w-lg mx-auto">
          <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
          <h3 className="fw-bold font-serif">Reservation Not Found</h3>
          <p className="text-muted">{error || 'Unable to retrieve this reservation.'}</p>
          <Link to="/dashboard" className="btn btn-navy mt-3">
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const room = booking.room || {};
  const user = booking.user || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Success Header Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '70px', height: '70px', background: '#D1E7DD', color: '#0F5132' }}
          >
            <i className="bi bi-check-lg fs-1"></i>
          </div>
          <span className="text-uppercase fw-bold small text-success" style={{ letterSpacing: '1.5px' }}>
            Reservation Confirmed
          </span>
          <h2 className="display-6 fw-bold font-serif mt-1">Thank You for Choosing HotelPro</h2>
          <p className="text-muted mb-3">
            A confirmation receipt has been generated. Your suite is reserved and awaiting your arrival.
          </p>
          <div className="d-inline-flex align-items-center justify-content-center gap-2 p-2 px-3 bg-light rounded-3 mx-auto">
            <span className="text-muted small">Reservation Code:</span>
            <strong className="text-primary font-monospace fs-6">
              HP-{booking._id?.toString().slice(-8).toUpperCase()}
            </strong>
          </div>
        </div>

        {/* Printable Reservation Receipt Card */}
        <div className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white mb-4" id="printable-receipt">
          {/* Receipt Top Bar */}
          <div className="d-flex justify-content-between align-items-center pb-4 border-bottom mb-4">
            <div>
              <span className="brand-title fs-4">
                Hotel<span className="brand-dot">Pro</span>
              </span>
              <p className="text-muted small mb-0">Luxury Resort & Residences</p>
            </div>
            <div className="text-end">
              <span className="badge bg-success py-2 px-3 fs-6">
                Status: {booking.bookingStatus}
              </span>
              <small className="d-block text-muted mt-1">
                Booked on: {formatDate(booking.createdAt)}
              </small>
            </div>
          </div>

          {/* Reserved Room Summary */}
          <div className="row g-4 align-items-center mb-4 pb-4 border-bottom">
            <div className="col-md-4">
              <div className="rounded-3 overflow-hidden shadow-sm" style={{ height: '140px' }}>
                <img
                  src={
                    room.images?.[0] ||
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={room.title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2 align-items-center mb-1">
                <span className="badge badge-gold">{room.type}</span>
                <span className="badge bg-light text-dark border">Room #{room.roomNumber}</span>
              </div>
              <h4 className="fw-bold font-serif mb-2">{room.title}</h4>
              <p className="text-muted small mb-0">
                <i className="bi bi-moon-stars me-1 text-primary"></i>
                {room.bedType || 'Plush Bedding'} &bull; Up to {booking.guests} Guest(s)
              </p>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="row g-4 mb-4 pb-4 border-bottom">
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold">Check-in</small>
              <strong className="fs-6 text-dark">{formatDate(booking.checkIn)}</strong>
              <small className="d-block text-muted">From 3:00 PM</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold">Check-out</small>
              <strong className="fs-6 text-dark">{formatDate(booking.checkOut)}</strong>
              <small className="d-block text-muted">Until 11:00 AM</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold">Duration</small>
              <strong className="fs-6 text-dark">
                {booking.nights} Night{booking.nights > 1 ? 's' : ''}
              </strong>
              <small className="d-block text-muted">{booking.guests} Guest(s)</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold">Payment Status</small>
              <span className="badge bg-warning text-dark mt-1">
                {booking.paymentStatus}
              </span>
              <small className="d-block text-muted mt-1">Due at hotel desk</small>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-4 pb-4 border-bottom">
            <h6 className="fw-bold text-uppercase small text-muted mb-3" style={{ letterSpacing: '1px' }}>
              Primary Guest Contact
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <small className="text-muted d-block">Full Name</small>
                <strong className="text-dark">{user.name || 'Valued Guest'}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted d-block">Email Address</small>
                <strong className="text-dark">{user.email || 'N/A'}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted d-block">Phone Number</small>
                <strong className="text-dark">{user.phone || 'On File'}</strong>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-3 p-3 bg-light rounded-3 small">
                <strong>Special Requests:</strong> {booking.specialRequests}
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div>
            <h6 className="fw-bold text-uppercase small text-muted mb-3" style={{ letterSpacing: '1px' }}>
              Pricing & Invoice Breakdown
            </h6>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Room Rate (${booking.pricePerNight} &times; {booking.nights} nights)</span>
              <span>${booking.totalPrice}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Estimated Hospitality Tax (Included)</span>
              <span>$0.00</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 text-dark pt-2 border-top">
              <span>Total Booking Amount</span>
              <span className="text-primary font-serif">${booking.totalPrice}</span>
            </div>
            <small className="text-muted d-block mt-2">
              Note: No live online payment was processed. Your card is kept on file to guarantee the suite.
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-between gap-3">
          <Link to="/" className="btn btn-outline-secondary px-4 py-2 rounded-3">
            <i className="bi bi-house me-1"></i> Return Home
          </Link>
          <div className="d-flex gap-2">
            <button onClick={handlePrint} className="btn btn-outline-navy px-4 py-2 rounded-3">
              <i className="bi bi-printer me-1"></i> Print Receipt
            </button>
            <Link to="/dashboard" className="btn btn-navy px-4 py-2 rounded-3 shadow-sm">
              <i className="bi bi-calendar2-check me-1"></i> View My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
