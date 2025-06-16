const request = require('supertest');
const app = require('../app');

describe('CORS Configuration Tests', () => {
  
  test('Should allow requests from localhost:5173', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'http://localhost:5173')
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  test('Should allow requests from production Netlify domain', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://your-deployed-app.netlify.app')
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe('https://your-deployed-app.netlify.app');
  });

  test('Should allow requests from Bolt.new preview domains', async () => {
    const boltOrigin = 'https://abc123-def456.bolt.new';
    const response = await request(app)
      .get('/api/data')
      .set('Origin', boltOrigin)
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe(boltOrigin);
  });

  test('Should reject requests from unauthorized origins', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://malicious-site.com')
      .expect(403);
    
    expect(response.body.error).toBe('CORS Policy Violation');
  });

  test('Should allow requests with no origin (same-origin)', async () => {
    const response = await request(app)
      .get('/api/data')
      .expect(200);
    
    expect(response.body.message).toBe('CORS is working!');
  });

  test('Should handle preflight OPTIONS requests', async () => {
    const response = await request(app)
      .options('/api/data')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(204);
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
  });

  test('Should reject invalid Bolt.new domains', async () => {
    const invalidBoltOrigin = 'https://malicious.bolt.new.evil.com';
    const response = await request(app)
      .get('/api/data')
      .set('Origin', invalidBoltOrigin)
      .expect(403);
    
    expect(response.body.error).toBe('CORS Policy Violation');
  });

  test('Should include credentials in CORS headers', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'http://localhost:5173')
      .expect(200);
    
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

});