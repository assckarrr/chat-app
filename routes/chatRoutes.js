const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Send a message
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    const newMessage = new Message({ sender: req.user.id, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;