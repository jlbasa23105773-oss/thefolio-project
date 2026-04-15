// quick-test.js - Test the backend login endpoint
const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login endpoint...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@thefolio.com',
      password: 'Admin@1234'
    });

    console.log('✅ SUCCESS! Backend login is working!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR!\n');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', error.message);
  }
}

testLogin();