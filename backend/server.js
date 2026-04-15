const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes    = require('./routes/auth.routes');
const postRoutes    = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes   = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const User          = require('./models/User');

const app = express();

// ── CORS ── must come BEFORE routes, and only declared ONCE
// ROOT CAUSE #1 FIX: app.use(cors()) was called twice — the first open call
// was blocking the second configured one. Removed the duplicate.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     authRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin',    adminRoutes);

const PORT = process.env.PORT || 5000;

const ensureAdminUser = async () => {
  const adminEmail = 'admin@thefolio.com';
  const adminPassword = 'Admin@1234';
  const adminName = 'TheFolio Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    if (!existingAdmin.password.startsWith('$2')) {
      existingAdmin.password = adminPassword;
      existingAdmin.markModified('password');
      await existingAdmin.save();
      console.log('Admin password hashed and updated.');
    } else {
      console.log('Admin account already exists.');
    }
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log('Admin account created successfully!');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
};

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();