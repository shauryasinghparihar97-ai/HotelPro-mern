import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-5">
      <div className="container">
        {/* Hero Banner */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-muted" style={{ letterSpacing: '2px' }}>
            Heritage & Distinction
          </span>
          <h1 className="display-4 fw-bold font-serif mt-1">The HotelPro Story</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '720px' }}>
            Born from a passionate devotion to architectural grandeur and deeply personal hospitality, HotelPro redefined modern resort living along the Californian coast.
          </p>
        </div>

        {/* Story Section */}
        <div className="row align-items-center g-5 mb-5 pb-4">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                alt="Hotel exterior"
                className="rounded-4 shadow-lg w-100 object-fit-cover"
                style={{ height: '420px' }}
              />
              <div
                className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow-md border"
                style={{ maxWidth: '240px' }}
              >
                <div className="fw-bold font-serif text-navy">Founded in 2018</div>
                <small className="text-muted">Over 8 years of world-renowned five-star service</small>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <h3 className="fw-bold font-serif mb-3">A Vision of Coastal Tranquility</h3>
            <p className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
              From the inception of HotelPro, our mission was simple: eliminate the friction of travel and immerse guests in genuine, personalized comfort. Designed by celebrated modernist architects, every guest room maximizes natural light, provides sweeping ocean vistas, and blends natural timber and Italian stone.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              Whether you are arriving for an anniversary retreat, executive strategy summit, or solo wellness rejuvenation, our staff curates every hour to suit your rhythm.
            </p>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3 bg-white rounded-3 border">
                  <h4 className="fw-bold text-navy font-serif mb-1">98.4%</h4>
                  <small className="text-muted">Guest Satisfaction Rating</small>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-white rounded-3 border">
                  <h4 className="fw-bold text-navy font-serif mb-1">32+</h4>
                  <small className="text-muted">International Hospitality Awards</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="card border-0 bg-white rounded-4 shadow-sm p-4 p-md-5 mb-5">
          <div className="text-center mb-5">
            <h3 className="fw-bold font-serif">Our Hospitality Commitments</h3>
            <p className="text-muted small">Guiding every interaction from arrival to departure</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="badge bg-navy p-3 rounded-circle mb-3" style={{ background: 'var(--hotel-navy)' }}>
                <i className="bi bi-heart-pulse fs-3 text-white"></i>
              </div>
              <h5 className="fw-bold font-serif mb-2">Intuitive Care</h5>
              <p className="text-muted small">
                Anticipating your wishes before they are spoken. From your preferred room temperature to tailored dietary selections.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div className="badge bg-gold p-3 rounded-circle mb-3" style={{ background: 'var(--hotel-gold)' }}>
                <i className="bi bi-tree fs-3 text-white"></i>
              </div>
              <h5 className="fw-bold font-serif mb-2">Sustainable Luxury</h5>
              <p className="text-muted small">
                100% renewable energy resort operations, organic farm-to-table culinary partnerships, and zero single-use plastics.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div className="badge bg-navy p-3 rounded-circle mb-3" style={{ background: 'var(--hotel-navy)' }}>
                <i className="bi bi-shield-lock fs-3 text-white"></i>
              </div>
              <h5 className="fw-bold font-serif mb-2">Discretion & Privacy</h5>
              <p className="text-muted small">
                Comprehensive privacy safeguards, secluded suites, and discreet concierge coordination for high-profile stays.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          className="rounded-4 p-5 text-center text-white position-relative overflow-hidden shadow"
          style={{
            background: 'linear-gradient(135deg, var(--hotel-navy) 0%, var(--hotel-navy-light) 100%)',
          }}
        >
          <h2 className="display-6 fw-bold font-serif mb-3 text-white">Your Unforgettable Escape Awaits</h2>
          <p className="text-light opacity-90 mx-auto mb-4" style={{ maxWidth: '600px' }}>
            Allow our concierge team to prepare your private sanctuary. Explore our collection of ocean suites today.
          </p>
          <Link to="/rooms" className="btn btn-gold btn-lg px-4 shadow">
            Explore All Accommodations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
