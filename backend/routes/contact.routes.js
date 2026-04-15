const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

router.get('/', async (req, res) => {
  const user = await getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Authentication required to view your messages' });
  }

  try {
    const messages = await Message.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('replies.repliedBy', 'name email');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const user = await getUserFromToken(req);
  const senderName = user?.name || (name || '').trim();
  const senderEmail = user?.email || (email || '').trim().toLowerCase();

  if (!senderName || !senderEmail) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const contactMessage = await Message.create({
      name: senderName,
      email: senderEmail,
      message: message.trim(),
      user: user?._id,
    });

    res.status(201).json(contactMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
