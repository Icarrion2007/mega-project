// LOAD .env FIRST
require('dotenv').config({ path: '.env.development' });

const https = require('https');

console.log('🔍 VERCEL FEC API TEST (WITH .env LOADING)');
console.log('='.repeat(50));

const FEC_API_KEY = process.env.FEC_API_KEY;
console.log('API Key from .env:', !!FEC_API_KEY ? 'PRESENT' : 'MISSING');
if (FEC_API_KEY) {
  console.log('Full key (first/last 5):', 
    FEC_API_KEY.substring(0, 5) + '...' + 
    FEC_API_KEY.substring(FEC_API_KEY.length - 5));
}

// Use the actual key, not DEMO_KEY
const testUrl = `https://api.open.fec.gov/v1/names/candidates/?q=biden&api_key=${FEC_API_KEY || 'DEMO_KEY'}`;

console.log('\n📡 Testing with actual API key...');

const req = https.get(testUrl, (res) => {
  console.log('✅ Status:', res.statusCode);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Results:', json.results?.length || 0);
      
      // Check if it's using our key or demo
      if (FEC_API_KEY && res.headers['x-ratelimit-remaining']) {
        console.log('Rate limit remaining:', res.headers['x-ratelimit-remaining']);
        console.log('✅ Using YOUR API key');
      } else {
        console.log('⚠️ Using DEMO_KEY (rate limited)');
      }
    } catch (e) {
      console.log('Parse error');
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Network error:', err.message);
});

req.setTimeout(5000, () => {
  console.log('⏰ Timeout');
  req.destroy();
});
