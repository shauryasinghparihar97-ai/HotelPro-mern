import React from 'react';

const RoomFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 text-navy d-flex align-items-center gap-2">
          <i className="bi bi-sliders text-warning"></i> Refine Your Selection
        </h6>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-sm btn-link text-decoration-none text-muted p-0"
        >
          <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
        </button>
      </div>

      <div className="row g-3">
        {/* Keyword Search */}
        <div className="col-md-3 col-sm-6">
          <label className="form-label small fw-semibold text-muted">Search Room</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              name="search"
              className="form-control border-start-0"
              placeholder="e.g. Ocean, Suite, 101"
              value={filters.search || ''}
              onChange={onFilterChange}
            />
          </div>
        </div>

        {/* Room Type */}
        <div className="col-md-3 col-sm-6">
          <label className="form-label small fw-semibold text-muted">Room Type</label>
          <select
            name="type"
            className="form-select form-select-sm"
            value={filters.type || 'All'}
            onChange={onFilterChange}
          >
            <option value="All">All Room Types</option>
            <option value="Single">Single Sanctuary</option>
            <option value="Double">Double Room</option>
            <option value="Deluxe">Deluxe Suite</option>
            <option value="Suite">Executive Suite</option>
            <option value="Presidential">Presidential Penthouse</option>
          </select>
        </div>

        {/* Guests Capacity */}
        <div className="col-md-3 col-sm-6">
          <label className="form-label small fw-semibold text-muted">Guests</label>
          <select
            name="guests"
            className="form-select form-select-sm"
            value={filters.guests || ''}
            onChange={onFilterChange}
          >
            <option value="">Any Capacity</option>
            <option value="1">1+ Guest</option>
            <option value="2">2+ Guests</option>
            <option value="3">3+ Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        {/* Max Price */}
        <div className="col-md-3 col-sm-6">
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label small fw-semibold text-muted">Max Rate / Night</label>
            <span className="small fw-bold text-primary">
              {filters.maxPrice ? `$${filters.maxPrice}` : 'Any Price'}
            </span>
          </div>
          <input
            type="range"
            name="maxPrice"
            className="form-range"
            min="100"
            max="1000"
            step="50"
            value={filters.maxPrice || 1000}
            onChange={onFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;
