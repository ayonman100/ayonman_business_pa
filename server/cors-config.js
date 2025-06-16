const cors = require('cors');

/**
 * CORS Configuration for Express.js Application
 * 
 * Security Considerations:
 * 1. Explicit origin validation prevents unauthorized cross-origin requests
 * 2. Pattern matching for wildcard domains (*.bolt.new) with proper validation
 * 3. Allows same-origin requests (no origin header)
 * 4. Rejects requests from unauthorized origins with proper error handling
 * 5. Supports both development and production environments
 */

// Define allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',                    // Local development server
  'https://your-deployed-app.netlify.app',   // Production deployment
  // Bolt.new preview domains will be handled by pattern matching
];

// Pattern for Bolt.new preview domains
const BOLT_NEW_PATTERN = /^https:\/\/[a-zA-Z0-9-]+\.bolt\.new$/;

/**
 * Custom origin validator function
 * @param {string|undefined} origin - The origin of the request
 * @param {Function} callback - Callback function to call with validation result
 */
const originValidator = (origin, callback) => {
  // Allow requests with no origin (same-origin requests, mobile apps, etc.)
  if (!origin) {
    console.log('CORS: Allowing request with no origin (same-origin or mobile app)');
    return callback(null, true);
  }

  // Check if origin is in the explicit allowed list
  if (ALLOWED_ORIGINS.includes(origin)) {
    console.log(`CORS: Allowing request from explicitly allowed origin: ${origin}`);
    return callback(null, true);
  }

  // Check if origin matches Bolt.new pattern
  if (BOLT_NEW_PATTERN.test(origin)) {
    console.log(`CORS: Allowing request from Bolt.new preview domain: ${origin}`);
    return callback(null, true);
  }

  // Origin not allowed
  console.warn(`CORS: Blocking request from unauthorized origin: ${origin}`);
  const error = new Error(`CORS policy violation: Origin ${origin} is not allowed`);
  error.status = 403;
  return callback(error, false);
};

/**
 * CORS options configuration
 */
const corsOptions = {
  // Custom origin validation
  origin: originValidator,
  
  // Allow credentials (cookies, authorization headers, etc.)
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-API-Key'
  ],
  
  // Headers exposed to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Rate-Limit-Remaining'
  ],
  
  // Preflight cache duration (in seconds)
  maxAge: 86400, // 24 hours
  
  // Handle preflight requests
  preflightContinue: false,
  
  // Provide a status code for successful OPTIONS requests
  optionsSuccessStatus: 204
};

/**
 * Create and export the CORS middleware
 */
const corsMiddleware = cors(corsOptions);

/**
 * Enhanced CORS middleware with additional logging and error handling
 */
const enhancedCorsMiddleware = (req, res, next) => {
  // Log incoming request details for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`CORS: Processing ${req.method} request from origin: ${req.get('Origin') || 'no origin'}`);
  }

  // Apply CORS middleware
  corsMiddleware(req, res, (err) => {
    if (err) {
      // Log CORS errors
      console.error('CORS Error:', err.message);
      
      // Send appropriate error response
      return res.status(err.status || 403).json({
        error: 'CORS Policy Violation',
        message: 'This origin is not allowed to access this resource',
        origin: req.get('Origin'),
        timestamp: new Date().toISOString()
      });
    }
    
    // Continue to next middleware if CORS validation passed
    next();
  });
};

/**
 * Utility function to add a new allowed origin at runtime
 * Useful for dynamic origin management
 */
const addAllowedOrigin = (origin) => {
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    ALLOWED_ORIGINS.push(origin);
    console.log(`CORS: Added new allowed origin: ${origin}`);
    return true;
  }
  return false;
};

/**
 * Utility function to remove an allowed origin at runtime
 */
const removeAllowedOrigin = (origin) => {
  const index = ALLOWED_ORIGINS.indexOf(origin);
  if (index > -1) {
    ALLOWED_ORIGINS.splice(index, 1);
    console.log(`CORS: Removed allowed origin: ${origin}`);
    return true;
  }
  return false;
};

/**
 * Get current CORS configuration for debugging
 */
const getCorsConfig = () => {
  return {
    allowedOrigins: [...ALLOWED_ORIGINS],
    boltNewPattern: BOLT_NEW_PATTERN.toString(),
    corsOptions: {
      ...corsOptions,
      origin: 'Custom validator function'
    }
  };
};

module.exports = {
  corsMiddleware: enhancedCorsMiddleware,
  addAllowedOrigin,
  removeAllowedOrigin,
  getCorsConfig,
  corsOptions
};