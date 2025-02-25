const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (Admin only)
router.delete('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a chat message (Admin only)
router.delete('/messages/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;