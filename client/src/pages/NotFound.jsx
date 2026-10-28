import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="py-5 d-flex align-items-center text-center" style={{ minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white">
          <span className="display-1 fw-bold font-serif text-muted mb-2">404</span>
          <h2 className="fw-bold font-serif mb-3 text-navy">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page or suite you are searching for might have been moved or is temporarily unavailable.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn btn-navy px-4 py-2">
              Return to Home
            </Link>
            <Link to="/rooms" className="btn btn-outline-gold px-4 py-2">
              Browse Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
