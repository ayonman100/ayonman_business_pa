const express = require('express');
const { corsMiddleware, getCorsConfig } = require('./cors-config');

const app = express();

/**
 * Apply CORS middleware before other middleware
 * This ensures CORS headers are set for all requests
 */
app.use(corsMiddleware);

/**
 * Standard middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cors: process.env.NODE_ENV === 'development' ? getCorsConfig() : 'configured'
  });
});

/**
 * CORS configuration endpoint (development only)
 */
if (process.env.NODE_ENV === 'development') {
  app.get('/cors-config', (req, res) => {
    res.json(getCorsConfig());
  });
}

/**
 * Example API routes
 */
app.get('/api/data', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/data', (req, res) => {
  res.json({
    message: 'POST request successful',
    data: req.body,
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS configuration loaded successfully');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('CORS Config:', getCorsConfig());
  }
});

module.exports = app;