const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();
// All routes below require: (1) valid token AND (2) admin role
router.use(protect, adminOnly);
router.get('/users', async (req, res) => {
try {
const users = await User.find({ role: { $ne: 'admin' } })
.select('-password')
.sort({ createdAt: -1 });
res.json(users);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// PUT /api/admin/users/:id/status — Toggle member active/inactive
router.put('/users/:id/status', async (req, res) => {
try {
const user = await User.findById(req.params.id);
if (!user || user.role === 'admin')
return res.status(404).json({ message: 'User not found' });
user.status = user.status === 'active' ? 'inactive' : 'active';
await user.save();
res.json({ message: `User is now ${user.status}`, user });
} catch (err) { res.status(500).json({ message: err.message }); }
});
// GET /api/admin/posts — List ALL posts including removed ones
router.get('/posts', async (req, res) => {
try {
const posts = await Post.find()
.populate('author', 'name email')
.sort({ createdAt: -1 });
res.json(posts);
} catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/admin/messages — List incoming contact messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('user', 'name email role status')
            .populate('replies.repliedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/messages/:id — Get single message with replies
router.get('/messages/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('user', 'name email role status')
            .populate('replies.repliedBy', 'name email');
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/messages/:id/reply — Add reply to a message
router.post('/messages/:id/reply', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Reply text is required' });
        }
        
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        
        message.replies.push({
            text: text.trim(),
            repliedBy: req.user._id,
            createdAt: new Date()
        });
        
        await message.save();
        
        const updatedMessage = await Message.findById(req.params.id)
            .populate('user', 'name email role status')
            .populate('replies.repliedBy', 'name email');
        
        res.json({ message: 'Reply sent successfully', data: updatedMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/admin/posts/:id/remove — Mark post as removed (inappropriate)
router.put('/posts/:id/remove', async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
post.status = 'removed';
await post.save();
res.json({ message: 'Post has been removed', post });
} catch (err) { res.status(500).json({ message: err.message }); }
});// PUT /api/admin/posts/:id/restore — Ibalik ang post mula sa Bin
router.put('/posts/:id/restore', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        post.status = 'published';
        await post.save();
        res.json({ message: 'Post restored successfully', post });
    } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;