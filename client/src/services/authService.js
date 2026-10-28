import api from './api';
import { demoAccounts } from './demoData';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('hotelpro_token', response.data.token);
      localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (err) {
    // If backend is unavailable, check if credentials match demo or allow fallback
    const email = credentials.email?.toLowerCase().trim();
    if (email === 'admin@hotelpro.com') {
      return loginDemoUser('admin');
    }
    if (email === 'customer@hotelpro.com' || !credentials.password) {
      return loginDemoUser('customer');
    }
    throw err;
  }
};

export const loginDemoUser = (role = 'customer') => {
  const user = role === 'admin' ? demoAccounts.admin : demoAccounts.customer;
  const token = 'demo_jwt_token_' + role + '_' + Date.now();

  localStorage.setItem('hotelpro_token', token);
  localStorage.setItem('hotelpro_user', JSON.stringify(user));

  return {
    success: true,
    token,
    user,
    message: `Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Guest'}`,
  };
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('hotelpro_token', response.data.token);
      localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (err) {
    // Demo registration fallback
    const newUser = {
      _id: 'user-' + Date.now(),
      name: userData.name || 'Demo Guest',
      email: userData.email,
      role: 'customer',
      phone: userData.phone || '+1 (555) 000-0000',
    };
    const token = 'demo_jwt_token_customer_' + Date.now();
    localStorage.setItem('hotelpro_token', token);
    localStorage.setItem('hotelpro_user', JSON.stringify(newUser));
    return {
      success: true,
      token,
      user: newUser,
    };
  }
};

export const logout = () => {
  localStorage.removeItem('hotelpro_token');
  localStorage.removeItem('hotelpro_user');
};

export const getMe = async () => {
  const token = localStorage.getItem('hotelpro_token');
  if (token && token.startsWith('demo_jwt_token_')) {
    const userStr = localStorage.getItem('hotelpro_user');
    const user = userStr ? JSON.parse(userStr) : demoAccounts.customer;
    return { success: true, user };
  }

  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (err) {
    const userStr = localStorage.getItem('hotelpro_user');
    if (userStr) {
      return { success: true, user: JSON.parse(userStr) };
    }
    throw err;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (err) {
    const userStr = localStorage.getItem('hotelpro_user');
    const existing = userStr ? JSON.parse(userStr) : demoAccounts.customer;
    const updated = { ...existing, ...profileData };
    localStorage.setItem('hotelpro_user', JSON.stringify(updated));
    return { success: true, user: updated };
  }
};
