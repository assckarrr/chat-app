const express = require('express');
const Message = require('../models/Message');
const { authenticateToken, authorizeAdmin, authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new message
router.post('/messages', authenticateUser, async (req, res) => {
    try {
        const { content } = req.body;
        const newMessage = new Message({
            sender: req.user.username,
            content,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Retrieve all messages for the logged-in user
router.get('/messages', authenticateUser, async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Retrieve a specific message by its ID
router.get('/messages/:id', authenticateUser, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a specific message
router.put('/messages/:id', authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const { content } = req.body;
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        if (message.sender !== req.user.username && req.user.role != "admin") return res.status(403).json({ message: 'Unauthorized' });

        message.content = content;
        await message.save();
        res.json({ message: 'Message updated successfully', message });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a specific message
router.delete('/messages/:id', authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        console.log(message);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        if (message.sender !== req.user.username && req.user.role != "admin") return res.status(403).json({ message: 'Unauthorized' });

        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;