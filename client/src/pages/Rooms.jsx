import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as roomService from '../services/roomService';
import RoomCard from '../components/rooms/RoomCard';
import RoomFilter from '../components/rooms/RoomFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'All',
    guests: searchParams.get('guests') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  });

  const fetchRooms = async (currentFilters) => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.type && currentFilters.type !== 'All') params.type = currentFilters.type;
      if (currentFilters.guests) params.guests = currentFilters.guests;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
      if (currentFilters.checkIn && currentFilters.checkOut) {
        params.checkIn = currentFilters.checkIn;
        params.checkOut = currentFilters.checkOut;
      }

      const res = await roomService.getRooms(params);
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.message || 'Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key] && updated[key] !== 'All') {
        newParams.set(key, updated[key]);
      }
    });
    setSearchParams(newParams);

    // Refetch
    fetchRooms(updated);
  };

  const handleReset = () => {
    const cleared = {
      search: '',
      type: 'All',
      guests: '',
      maxPrice: '',
      checkIn: '',
      checkOut: '',
    };
    setFilters(cleared);
    setSearchParams(new URLSearchParams());
    fetchRooms(cleared);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-muted" style={{ letterSpacing: '2px' }}>
            Accommodations
          </span>
          <h1 className="display-5 fw-bold font-serif mt-1">Our Luxury Rooms & Suites</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Each suite at HotelPro is an enclave of serenity, designed with handcrafted furniture, spa-grade ensuites, and breathtaking horizons.
          </p>
        </div>

        {/* Date Filter Notification Banner if search had dates */}
        {filters.checkIn && filters.checkOut && (
          <div className="alert alert-info d-flex align-items-center justify-content-between mb-4 rounded-3 shadow-sm">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-calendar2-range fs-5 text-primary"></i>
              <span>
                Filtering available accommodations for <strong>{filters.checkIn}</strong> to{' '}
                <strong>{filters.checkOut}</strong>
              </span>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                const updated = { ...filters, checkIn: '', checkOut: '' };
                setFilters(updated);
                fetchRooms(updated);
              }}
            >
              Clear Dates
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && <AlertMessage variant="danger" message={error} onClose={() => setError('')} />}

        {/* Filter Controls */}
        <RoomFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Rooms Grid */}
        {loading ? (
          <LoadingSpinner text="Searching available accommodations..." fullPage />
        ) : rooms.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm p-5 border">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <h4 className="fw-bold font-serif mb-2">No Accommodations Found</h4>
            <p className="text-muted mb-4">
              We couldn't find any rooms matching your exact filter preferences or dates.
            </p>
            <button onClick={handleReset} className="btn btn-navy px-4 py-2">
              Reset Filters & Show All Rooms
            </button>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted small fw-semibold">
                Showing <strong>{rooms.length}</strong> available suite{rooms.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="row g-4">
              {rooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
