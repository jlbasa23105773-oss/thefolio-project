const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['published', 'removed'], default: 'published' },
  // DAGDAG ITO PARA SA REACTIONS:
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, enum: ['like', 'heart', 'wow', 'sad', 'angry'] }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);