const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8082;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'student-portal-backend'
  });
});

// Test API
app.get('/api/v1/hello', (req, res) => {
  res.status(200).json({
    message: 'Hello from Student Portal Backend!',
    service: 'Cloud Run'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
