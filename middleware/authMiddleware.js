const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log(token);
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = verified;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};

const authenticateUser = async (req, res, next) => {
  try {
      let token;

      // Check if token exists in session
      if (req.session && req.session.token) {
          token = req.session.token;
      } else {
          token = req.header('Authorization')?.replace('Bearer ', '');
      }

      if (!token) {
          return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;

      console.log("Authenticated user:", req.user);
      next();
  } catch (err) {
      console.error("Authentication error:", err);
      res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is an admin
const authorizeAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { authenticateToken, authenticateSocket, authorizeAdmin, authenticateUser };