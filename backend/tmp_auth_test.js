(async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@thefolio.com', password: 'Admin@1234' }),
    });
    console.log('status', response.status);
    const text = await response.text();
    console.log('body', text);
  } catch (err) {
    console.error('error', err.message);
  }
})();
