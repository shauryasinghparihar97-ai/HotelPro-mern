import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3 border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="fs-3">🏨</span>
          <span className="brand-title">
            Hotel<span className="brand-dot">Pro</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 ${isActive ? 'text-primary' : 'text-dark'}`
                }
                to="/"
                onClick={() => setIsNavCollapsed(true)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 ${isActive ? 'text-primary' : 'text-dark'}`
                }
                to="/rooms"
                onClick={() => setIsNavCollapsed(true)}
              >
                Rooms & Suites
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 ${isActive ? 'text-primary' : 'text-dark'}`
                }
                to="/about"
                onClick={() => setIsNavCollapsed(true)}
              >
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 ${isActive ? 'text-primary' : 'text-dark'}`
                }
                to="/contact"
                onClick={() => setIsNavCollapsed(true)}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
                    {user?.name || 'My Account'}
                  </span>
                  {isAdmin && (
                    <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                      Admin
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold">{user?.name}</p>
                    <small className="text-muted">{user?.email}</small>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2 d-flex align-items-center gap-2"
                      to="/dashboard"
                      onClick={() => setIsNavCollapsed(true)}
                    >
                      <i className="bi bi-calendar-check text-primary"></i> My Bookings & Profile
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        className="dropdown-item py-2 d-flex align-items-center gap-2"
                        to="/admin"
                        onClick={() => setIsNavCollapsed(true)}
                      >
                        <i className="bi bi-speedometer2 text-warning"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                      onClick={() => {
                        setIsNavCollapsed(true);
                        handleLogout();
                      }}
                    >
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNavCollapsed(true);
                    loginDemo('customer');
                    navigate('/rooms');
                  }}
                  className="btn btn-warning text-dark px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 shadow-sm"
                  title="Instant Demo Access without password"
                >
                  <i className="bi bi-stars"></i>
                  <span>Guest Demo</span>
                </button>
                <Link
                  to="/login"
                  className="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-gold px-3 py-2 rounded-3 fw-semibold text-white shadow-sm"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  Join HotelPro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
