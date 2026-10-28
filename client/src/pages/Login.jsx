import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await login(formData);
      if (res.success) {
        if (res.user.role === 'admin' && redirectPath === '/') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo login (Zero password/ID required)
  const handleInstantDemo = (role = 'customer') => {
    try {
      const res = loginDemo(role);
      if (res.success) {
        if (role === 'admin' && redirectPath === '/') {
          navigate('/admin');
        } else {
          navigate(redirectPath === '/' ? '/rooms' : redirectPath);
        }
      }
    } catch (err) {
      console.error('Instant demo error:', err);
    }
  };

  // Quick Demo account fill for evaluations
  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@hotelpro.com',
        password: 'AdminPassword123!',
      });
    } else {
      setFormData({
        email: 'customer@hotelpro.com',
        password: 'CustomerPassword123!',
      });
    }
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '75vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
          <div className="text-center mb-4">
            <span className="fs-1">🏨</span>
            <h2 className="fw-bold font-serif mt-2 mb-1 text-navy">Welcome to HotelPro</h2>
            <p className="text-muted small">Sign in to manage your bookings and luxury privileges</p>
          </div>

          {error && <AlertMessage variant="danger" message={error} onClose={() => setError('')} />}

          {/* 1-Click Instant Demo Access (No ID or Password Required) */}
          <div className="card border-0 bg-primary bg-opacity-10 rounded-3 p-3 mb-4 text-center shadow-sm">
            <div className="small fw-bold text-primary mb-2 d-flex align-items-center justify-content-center gap-1">
              <i className="bi bi-stars text-warning fs-6"></i>
              <span>Instant Demo Access (No Password Required)</span>
            </div>
            <button
              type="button"
              onClick={() => handleInstantDemo('customer')}
              className="btn btn-primary w-100 fw-semibold mb-2 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              <i className="bi bi-person-check-fill"></i>
              <span>Continue as Demo Guest</span>
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemo('admin')}
              className="btn btn-outline-dark btn-sm w-100 py-1 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-shield-lock-fill text-warning"></i>
              <span>Access Admin Demo Dashboard</span>
            </button>
          </div>

          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1 my-0 text-muted" />
            <span className="px-2 text-muted small text-uppercase" style={{ fontSize: '0.72rem' }}>
              or sign in with password
            </span>
            <hr className="flex-grow-1 my-0 text-muted" />
          </div>

          {/* Quick Demo Credential Pills */}
          <div className="bg-light p-2 rounded-3 mb-3 border text-center">
            <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>
              Auto-fill credentials:
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="btn btn-outline-secondary btn-sm flex-grow-1"
                style={{ fontSize: '0.78rem' }}
              >
                Fill Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="btn btn-outline-secondary btn-sm flex-grow-1"
                style={{ fontSize: '0.78rem' }}
              >
                Fill Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="form-control border-start-0"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold text-muted mb-0">Password</label>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none text-muted p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="form-control border-start-0"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-navy btn-lg w-100 py-3 fw-bold fs-6 shadow-sm mb-3"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <span className="text-muted small">Don't have a HotelPro account yet? </span>
            <Link to="/register" className="fw-semibold text-primary text-decoration-none small">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
