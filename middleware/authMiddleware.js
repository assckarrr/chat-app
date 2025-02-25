const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    console.log("Authenticated User:", req.user); // Debugging log
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
    req.user = verified;
    socket.user = verified;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};

const authorizeAdmin = async (req, res, next) => {
  try {
    console.log("Decoded user:", req.user); // Debugging: Check if `req.user` is set
      if (!req.user || !req.user.id) {
          return res.status(401).json({ message: 'Unauthorized access' });
      }
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      next();
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticateToken, authenticateSocket, authorizeAdmin };