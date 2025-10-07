#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import and use the API handlers
const photographsHandler = require('./api/photographs').default;
const uploadHandler = require('./api/assets/upload').default;

// Route handlers
app.all('/api/photographs', async (req, res) => {
  try {
    await photographsHandler(req, res);
  } catch (error) {
    console.error('Photographs API Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.all('/api/assets/upload', async (req, res) => {
  try {
    await uploadHandler(req, res);
  } catch (error) {
    console.error('Upload API Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/photographs`);
  console.log(`   POST http://localhost:${PORT}/api/photographs`);
  console.log(`   POST http://localhost:${PORT}/api/assets/upload`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log('');
  console.log('🔑 Use API key from .env.local for authentication');
  console.log('📱 Run "node test-upload.js" for testing instructions');
});