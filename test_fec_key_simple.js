require('dotenv').config({ path: '.env.development' });
const fetch = require('node-fetch');

const key = process.env.FEC_API_KEY;

if (!key) {
  console.log('❌ ERROR: FEC_API_KEY is not loaded');
  console.log('   File .env.development should contain: FEC_API_KEY=your_key');
  process.exit(1);
}

console.log('✅ Key loaded from .env.development');
console.log('   Key (first/last 4):', key.substring(0, 4) + '...' + key.substring(key.length-4));

// Test with simple candidates endpoint
const testUrl = `https://api.open.fec.gov/v1/candidates/?api_key=${key}&per_page=2`;

console.log('\n📡 Testing FEC API connection...');

fetch(testUrl)
  .then(response => {
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      return response.json();
    } else if (response.status === 403) {
      console.log('❌ 403 Forbidden: Key is invalid or expired');
      console.log('   Get new key: https://api.data.gov/signup/');
      process.exit(1);
    } else {
      console.log(`❌ Unexpected error: ${response.status}`);
      return response.json().then(err => {
        console.log('   Error details:', JSON.stringify(err));
      });
    }
  })
  .then(data => {
    if (data) {
      console.log('✅ SUCCESS! API key is VALID');
      console.log(`   Found ${data.pagination?.count || 'unknown'} candidates`);
      console.log('\n🎯 Key works for /candidates/ endpoint');
    }
  })
  .catch(error => {
    console.log('❌ Network/Request error:', error.message);
    console.log('   Try: npm install node-fetch');
  });
