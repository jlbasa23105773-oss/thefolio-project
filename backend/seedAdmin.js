const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./config/db');
const User = require('./models/User');
connectDB().then(async () => {
  const exists = await User.findOne({ email: 'admin@thefolio.com' });
  if (exists) {
    if (!exists.password.startsWith('$2')) {
      exists.password = 'Admin@1234';
      exists.markModified('password');
      await exists.save();
      console.log('Admin password has been hashed and updated.');
    } else {
      console.log('Admin account already exists with hashed password.');
    }
    process.exit();
  }

  await User.create({
    name: 'TheFolio Admin',
    email: 'admin@thefolio.com',
    password: 'Admin@1234',
    role: 'admin',
  });
  console.log('Admin account created successfully!');
  console.log('Email:admin@thefolio.com');
  console.log('Password:Admin@1234');
  process.exit();
});