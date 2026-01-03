require('dotenv').config({ path: '.env.development' });
const fetch = require('node-fetch');
const key = process.env.CONGRESS_API_KEY;

console.log('🔑 Key being used:', `"${key}"`);
console.log('📏 Length:', key.length);
console.log('🔍 First/last 4 chars:', key.substring(0,4), '...', key.substring(key.length-4));

// Make actual API call
const url = `https://api.congress.gov/v3/bill?format=json&limit=1&api_key=${key}`;
console.log('\n📡 Testing URL:', url.substring(0, 80) + '...');

fetch(url)
  .then(async r => {
    console.log('📊 Status:', r.status, r.statusText);
    if (r.status === 200) {
      const data = await r.json();
      console.log('✅ SUCCESS! Received', data.bills?.length || 0, 'bills');
      console.log('   First bill:', data.bills?.[0]?.title?.substring(0, 50) || 'N/A');
    } else {
      const error = await r.text();
      console.log('❌ Error response:', error.substring(0, 200));
    }
  })
  .catch(e => console.log('🌐 Network error:', e.message));
