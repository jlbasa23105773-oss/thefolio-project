const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();
// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
try {
const posts = await Post.find({ status: 'published' })
.populate('author', 'name profilePic')
.sort({ createdAt: -1 });
res.json(posts);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// GET /api/posts/:id — Public: single post by ID
router.get('/:id', async (req, res) => {
try {
const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
if (!post || post.status === 'removed')
return res.status(404).json({ message: 'Post not found' });
res.json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// POST /api/posts — Member or Admin: create new post
// upload.single('image') handles optional image file
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req,
res) => {
try {
const { title, body } = req.body;
const image = req.file ? req.file.filename : '';
const post = await Post.create({ title, body, image, author:
req.user._id });
await post.populate('author', 'name profilePic');
res.status(201).json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req,
res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const isOwner = post.author.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });
if (req.body.title) post.title = req.body.title;
if (req.body.body) post.body = req.body.body;
if (req.file) post.image = req.file.filename;
await post.save();
res.json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// DELETE /api/posts/:id — Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const isOwner = post.author.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });
await post.deleteOne();
res.json({ message: 'Post deleted successfully' });
} catch (err) { res.status(500).json({ message: err.message }); }
});
// PUT /api/posts/:id/react — Member: add/update/remove reaction
router.put('/:id/react', protect, async (req, res) => {
    const { type } = req.body; // like, heart, wow, sad, angry
    const userId = req.user._id;

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Hanapin kung may existing reaction na ang user
        const existingIndex = post.reactions.findIndex(
            r => r.user.toString() === userId.toString()
        );

        if (existingIndex > -1) {
            // Kung parehong type, i-remove (toggle off)
            if (post.reactions[existingIndex].type === type) {
                post.reactions.splice(existingIndex, 1);
            } else {
                // Kung magkaiba, i-update ang type
                post.reactions[existingIndex].type = type;
            }
        } else {
            // Kung wala pa, magdagdag ng bago
            post.reactions.push({ user: userId, type });
        }

        await post.save();
        
        // I-populate ang user name para sa tooltip sa frontend
        const updatedPost = await Post.findById(post._id).populate('reactions.user', 'name');
        res.json(updatedPost.reactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;