# Express.js CORS Configuration

A comprehensive CORS (Cross-Origin Resource Sharing) configuration for Express.js applications with advanced origin validation and security features.

## Features

- ✅ **Explicit Origin Validation**: Validates requests against a whitelist of allowed origins
- ✅ **Wildcard Domain Support**: Pattern matching for Bolt.new preview domains (`*.bolt.new`)
- ✅ **Same-Origin Requests**: Allows requests with no origin header
- ✅ **Security-First**: Rejects unauthorized origins with proper error responses
- ✅ **Development & Production**: Supports both environments with appropriate logging
- ✅ **Comprehensive Testing**: Full test suite included
- ✅ **Runtime Configuration**: Add/remove origins dynamically

## Allowed Origins

1. **Local Development**: `http://localhost:5173`
2. **Production**: `https://your-deployed-app.netlify.app`
3. **Bolt.new Previews**: `https://*.bolt.new` (pattern matched)
4. **Same-Origin**: Requests with no origin header

## Installation

```bash
npm install express cors
```

## Usage

### Basic Setup

```javascript
const express = require('express');
const { corsMiddleware } = require('./cors-config');

const app = express();

// Apply CORS middleware
app.use(corsMiddleware);

// Your routes here
app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Advanced Configuration

```javascript
const { 
  corsMiddleware, 
  addAllowedOrigin, 
  removeAllowedOrigin, 
  getCorsConfig 
} = require('./cors-config');

// Add a new allowed origin at runtime
addAllowedOrigin('https://new-domain.com');

// Remove an origin
removeAllowedOrigin('https://old-domain.com');

// Get current configuration (useful for debugging)
console.log(getCorsConfig());
```

## Security Considerations

### 1. Origin Validation
- **Explicit Whitelist**: Only pre-approved origins are allowed
- **Pattern Matching**: Secure regex validation for wildcard domains
- **No Wildcards**: Avoids dangerous `*` wildcard that allows all origins

### 2. Error Handling
- **Proper Error Responses**: Returns 403 status with descriptive error messages
- **Logging**: Comprehensive logging for security monitoring
- **No Information Leakage**: Error messages don't expose sensitive configuration

### 3. Headers Configuration
- **Credentials Support**: Allows cookies and authorization headers when needed
- **Method Restrictions**: Only allows necessary HTTP methods
- **Header Whitelist**: Explicit list of allowed request headers

### 4. Bolt.new Domain Validation
```javascript
// Secure pattern that prevents subdomain attacks
const BOLT_NEW_PATTERN = /^https:\/\/[a-zA-Z0-9-]+\.bolt\.new$/;

// ✅ Matches: https://abc123.bolt.new
// ✅ Matches: https://my-preview.bolt.new
// ❌ Rejects: https://malicious.bolt.new.evil.com
// ❌ Rejects: https://bolt.new.evil.com
```

## Testing

Run the test suite to verify CORS configuration:

```bash
npm test
```

### Test Coverage
- ✅ Allowed origins (localhost, production, Bolt.new)
- ✅ Rejected unauthorized origins
- ✅ Same-origin requests
- ✅ Preflight OPTIONS requests
- ✅ Invalid domain patterns
- ✅ Credentials handling

## Environment Variables

```bash
NODE_ENV=development  # Enables detailed logging and debug endpoints
PORT=3000            # Server port (optional)
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and CORS configuration (in development mode).

### CORS Configuration (Development Only)
```
GET /cors-config
```
Returns current CORS configuration for debugging.

## Common Issues & Solutions

### Issue: "CORS policy violation"
**Solution**: Check if your origin is in the allowed list or matches the Bolt.new pattern.

### Issue: Preflight requests failing
**Solution**: Ensure your client sends proper `Access-Control-Request-Method` and `Access-Control-Request-Headers`.

### Issue: Credentials not working
**Solution**: Verify both server (`credentials: true`) and client (`withCredentials: true`) are configured.

## Production Deployment

1. **Update Origins**: Replace `your-deployed-app.netlify.app` with your actual domain
2. **Environment Variables**: Set `NODE_ENV=production` to disable debug logging
3. **HTTPS Only**: Ensure all production origins use HTTPS
4. **Monitor Logs**: Watch for CORS violations in production logs

## License

MIT License - see LICENSE file for details.