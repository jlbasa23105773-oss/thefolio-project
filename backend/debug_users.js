const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB().then(async () => {
  const users = await User.find({});
  console.log('All users in database:');
  users.forEach(user => {
    console.log(`- Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Password hash: ${user.password.substring(0, 20)}...`);
  });
  
  const adminUser = await User.findOne({ email: 'admin@thefolio.com' });
  if (adminUser) {
    console.log('\nAdmin user found:');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Password hash:', adminUser.password);
    
    // Test password matching
    const match = await adminUser.matchPassword('Admin@1234');
    console.log('Password match with "Admin@1234":', match);
  } else {
    console.log('\nAdmin user NOT found!');
  }
  
  process.exit();
});
