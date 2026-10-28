import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';

const RoomCard = ({ room }) => {
  if (!room) return null;

  const mainImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="card hotel-card h-100 d-flex flex-column border-0">
      {/* Room Image Container */}
      <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
        <img
          src={mainImage}
          alt={room.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge badge-gold shadow-sm">{room.type}</span>
          {room.featured && (
            <span className="badge bg-warning text-dark shadow-sm">
              <i className="bi bi-star-fill me-1"></i> Featured
            </span>
          )}
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <span
            className={`badge shadow-sm ${
              room.status === 'Available'
                ? 'bg-success'
                : room.status === 'Booked'
                ? 'bg-secondary'
                : 'bg-warning text-dark'
            }`}
          >
            {room.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-semibold">
              <i className="bi bi-door-closed me-1"></i> Room {room.roomNumber}
            </small>
            <StarRating rating={room.rating || 4.8} />
          </div>

          <h5 className="card-title font-serif fw-bold mb-2">
            <Link
              to={`/rooms/${room._id}`}
              className="text-decoration-none text-dark hover-gold"
            >
              {room.title}
            </Link>
          </h5>

          <p className="card-text text-muted small mb-3 text-truncate-2" style={{ minHeight: '38px' }}>
            {room.description}
          </p>

          {/* Quick Specs */}
          <div className="d-flex flex-wrap gap-3 py-2 border-top border-bottom mb-3 text-muted small">
            <div>
              <i className="bi bi-people me-1 text-primary"></i>
              <span>Up to {room.capacity} Guests</span>
            </div>
            <div>
              <i className="bi bi-aspect-ratio me-1 text-primary"></i>
              <span>{room.roomSize || 40} m²</span>
            </div>
            <div>
              <i className="bi bi-moon-stars me-1 text-primary"></i>
              <span>{room.bedType || 'King Bed'}</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {room.amenities &&
              room.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="badge bg-light text-secondary border fw-normal"
                  style={{ fontSize: '0.75rem' }}
                >
                  {amenity}
                </span>
              ))}
            {room.amenities && room.amenities.length > 3 && (
              <span
                className="badge bg-light text-secondary border fw-normal"
                style={{ fontSize: '0.75rem' }}
              >
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="d-flex justify-content-between align-items-center pt-2">
          <div>
            <span className="text-muted small">Starting from</span>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fs-4 fw-bold font-serif" style={{ color: 'var(--hotel-navy)' }}>
                ${room.pricePerNight}
              </span>
              <span className="text-muted small">/ night</span>
            </div>
          </div>
          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-navy btn-sm px-3 py-2 d-flex align-items-center gap-1 shadow-sm"
          >
            <span>View Details</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
