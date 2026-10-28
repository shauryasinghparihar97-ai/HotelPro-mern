const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'customer') => {
  const secret = process.env.JWT_SECRET || 'hotelpro_default_dev_secret_fallback_2026';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
