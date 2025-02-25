const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = user.generateAuthToken();
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error:'+ error });
  }
});

router.post('/logout', (req, res) => {
  try {
      res.json({ message: 'Logged out successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
      const { username, email } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (username) user.username = username;
      if (email) user.email = email;
      await user.save();

      const newToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Profile updated successfully', user, token: newToken });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;