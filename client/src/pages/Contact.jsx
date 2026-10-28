import React, { useState } from 'react';
import AlertMessage from '../components/common/AlertMessage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-muted" style={{ letterSpacing: '2px' }}>
            Concierge & Inquiries
          </span>
          <h1 className="display-4 fw-bold font-serif mt-1">Connect with HotelPro</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
            Our 24/7 front desk and guest experience team are dedicated to ensuring every inquiry receives our undivided attention.
          </p>
        </div>

        <div className="row g-5 mb-5">
          {/* Contact Details & Hours */}
          <div className="col-lg-5">
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white h-100">
              <h4 className="fw-bold font-serif mb-4 text-navy">Direct Contact Info</h4>

              <div className="d-flex flex-column gap-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '48px', height: '48px', background: 'var(--hotel-gold-light)', color: 'var(--hotel-gold-dark)' }}
                  >
                    <i className="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Resort Location</h6>
                    <p className="text-muted small mb-0">
                      742 Evergreen Grand Avenue<br />
                      Coastal Bay Peninsula, CA 90210
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '48px', height: '48px', background: 'var(--hotel-gold-light)', color: 'var(--hotel-gold-dark)' }}
                  >
                    <i className="bi bi-telephone-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Telephone & Concierge</h6>
                    <p className="text-muted small mb-0">
                      Direct: +1 (800) 555-4683<br />
                      International: +1 (310) 555-0199
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '48px', height: '48px', background: 'var(--hotel-gold-light)', color: 'var(--hotel-gold-dark)' }}
                  >
                    <i className="bi bi-envelope-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Electronic Inquiries</h6>
                    <p className="text-muted small mb-0">
                      Reservations: reservations@hotelpro.com<br />
                      Concierge: concierge@hotelpro.com
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '48px', height: '48px', background: 'var(--hotel-gold-light)', color: 'var(--hotel-gold-dark)' }}
                  >
                    <i className="bi bi-clock-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Front Desk Hours</h6>
                    <p className="text-muted small mb-0">
                      Open 24 hours a day, 7 days a week, 365 days a year.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-3 bg-light rounded-3 border">
                <small className="text-muted d-block">
                  <i className="bi bi-info-circle me-1 text-primary"></i>
                  <strong>Valet Parking:</strong> Available 24 hours at the main grand portico for all registered guests.
                </small>
              </div>
            </div>
          </div>

          {/* Interactive Message Form */}
          <div className="col-lg-7">
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white">
              <h4 className="fw-bold font-serif mb-2 text-navy">Send Us a Message</h4>
              <p className="text-muted small mb-4">
                Have a special request, private event inquiry, or dietary question? Reach out to our team.
              </p>

              {submitted && (
                <AlertMessage
                  variant="success"
                  message="Thank you! Your message has been dispatched to our concierge team. We will respond promptly within 2 business hours."
                  onClose={() => setSubmitted(false)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Henderson"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. liam@example.com"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Private Yacht Excursion or Dietary Request"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Your Message *</label>
                    <textarea
                      rows="5"
                      required
                      placeholder="How may our concierge team assist with your upcoming stay?"
                      className="form-control"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-navy btn-lg px-4 py-3 fw-bold fs-6 shadow-sm d-flex align-items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Transmitting Message...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i>
                          <span>Send Message to Concierge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white">
          <div className="text-center mb-4">
            <h3 className="fw-bold font-serif text-navy">Frequently Asked Questions</h3>
            <p className="text-muted small">Everything you need to know about reserving at HotelPro</p>
          </div>

          <div className="accordion accordion-flush" id="faqAccordion">
            <div className="accordion-item border-bottom py-2">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed fw-bold text-navy"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  What are the check-in and check-out times?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Standard guest check-in commences at 3:00 PM. Check-out is scheduled by 11:00 AM. Early check-in and late departures may be coordinated with our concierge desk subject to suite availability.
                </div>
              </div>
            </div>

            <div className="accordion-item border-bottom py-2">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed fw-bold text-navy"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  How does reservation payment work?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted small">
                  For your convenience, your online booking secures your suite instantly without upfront online card charging. Your payment status will remain "Pending" and will be finalized securely at the front desk upon check-in.
                </div>
              </div>
            </div>

            <div className="accordion-item border-bottom py-2">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed fw-bold text-navy"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Can I cancel my booking if my plans change?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Yes! You can cancel any reservation with future check-in dates directly from your Customer Dashboard with a single click. The room will automatically be released and returned to the inventory.
                </div>
              </div>
            </div>

            <div className="accordion-item py-2">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className="accordion-button collapsed fw-bold text-navy"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  Is high-speed Wi-Fi included throughout the property?
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Complimentary ultra-high-speed fiber optic Wi-Fi (up to 1 Gbps) is provided across all suites, beachfront cabanas, club lounges, and meeting salons for an unlimited number of devices.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
