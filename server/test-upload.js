#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Simple test script to test upload functionality
async function testUpload() {
  console.log('🧪 Testing Upload API Locally...\n');

  // You can test in two ways:

  console.log('📝 Method 1: Using curl command');
  console.log('Run this command with a test image:');
  console.log('');
  console.log('curl -X POST http://localhost:3000/api/assets/upload \\');
  console.log('  -H "Authorization: Bearer my-local-test-key" \\');
  console.log('  -F "image=@/path/to/your/test-image.jpg"');
  console.log('');

  console.log('📝 Method 2: Using online tools');
  console.log('1. Use Postman or Insomnia');
  console.log('2. Set URL: http://localhost:3000/api/assets/upload');
  console.log('3. Set Method: POST');
  console.log('4. Add Header: Authorization: Bearer my-local-test-key');
  console.log('5. Add Form Data: key="image", value=<select image file>');
  console.log('');

  console.log('📝 Method 3: Using fetch in browser console');
  console.log(`
const formData = new FormData();
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  formData.append('image', file);
  
  const response = await fetch('http://localhost:3000/api/assets/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer my-local-test-key'
    },
    body: formData
  });
  
  console.log('Response:', await response.json());
};
fileInput.click();
  `);

  console.log('🔧 Make sure to:');
  console.log('1. Update .env.local with your real CMS credentials');
  console.log('2. Start the server with: npm run dev (after vercel login)');
  console.log('3. Or use a different local server approach');
}

testUpload().catch(console.error);