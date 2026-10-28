import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3">🏨</span>
              <span className="brand-title text-white">
                Hotel<span style={{ color: 'var(--hotel-gold)' }}>Pro</span>
              </span>
            </div>
            <p className="text-light opacity-75 small pe-lg-4">
              Where timeless luxury meets modern hospitality. Experience exquisite suites, world-class dining, and tailored concierge care designed for memorable stays.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3 text-light">
              <a href="#" className="text-light opacity-75 text-decoration-none hover-gold"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light opacity-75 text-decoration-none hover-gold"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light opacity-75 text-decoration-none hover-gold"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-light opacity-75 text-decoration-none hover-gold"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--hotel-gold)' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-light text-decoration-none opacity-75">Home</Link></li>
              <li><Link to="/rooms" className="text-light text-decoration-none opacity-75">Rooms & Suites</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none opacity-75">About HotelPro</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none opacity-75">Contact & Support</Link></li>
              <li><Link to="/dashboard" className="text-light text-decoration-none opacity-75">Customer Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--hotel-gold)' }}>
              Concierge Desk
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-light opacity-75">
              <li className="d-flex gap-2">
                <i className="bi bi-geo-alt-fill text-warning"></i>
                <span>742 Evergreen Grand Avenue, Coastal Bay, CA 90210</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-telephone-fill text-warning"></i>
                <span>+1 (800) 555-HOTEL (46835)</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-envelope-fill text-warning"></i>
                <span>reservations@hotelpro.com</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-clock-fill text-warning"></i>
                <span>24/7 Front Desk & Concierge</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--hotel-gold)' }}>
              Exclusive Offers
            </h6>
            <p className="text-light opacity-75 small">
              Subscribe to receive private invitations, seasonal privileges, and member rates.
            </p>
            {subscribed ? (
              <div className="alert alert-success py-2 px-3 small rounded-3">
                <i className="bi bi-check-circle me-1"></i> Welcome to the HotelPro Club!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
                <div className="input-group">
                  <input
                    type="email"
                    required
                    className="form-control form-control-sm"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button className="btn btn-gold btn-sm" type="submit">
                    Join
                  </button>
                </div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  No spam. Unsubscribe anytime.
                </small>
              </form>
            )}
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-light opacity-75">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} HotelPro Resort & Residences. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="#privacy" className="text-light text-decoration-none">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#terms" className="text-light text-decoration-none">Terms of Service</a>
            <span>&bull;</span>
            <a href="#accessibility" className="text-light text-decoration-none">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
