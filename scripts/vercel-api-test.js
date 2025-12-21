const https = require('https');

console.log('🔍 VERCEL FEC API TEST');
console.log('='.repeat(50));

const FEC_API_KEY = process.env.FEC_API_KEY;
console.log('API Key present:', !!FEC_API_KEY);
if (FEC_API_KEY) {
  console.log('First 10 chars:', FEC_API_KEY.substring(0, 10) + '...');
}

// Test 1: Simple endpoint
const testUrl = `https://api.open.fec.gov/v1/names/candidates/?q=biden&api_key=${FEC_API_KEY || 'DEMO_KEY'}`;

console.log('\n📡 Testing FEC API from Vercel environment...');
console.log('URL:', testUrl.replace(FEC_API_KEY || 'DEMO_KEY', 'API_KEY_REDACTED'));

const req = https.get(testUrl, (res) => {
  console.log('\n✅ HTTP Response:');
  console.log('   Status:', res.statusCode);
  console.log('   Headers:', JSON.stringify(res.headers));
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('   Body length:', data.length, 'bytes');
    if (data.length < 500) {
      console.log('   Body:', data);
    }
    try {
      const json = JSON.parse(data);
      console.log('   Valid JSON:', !!json);
      if (json.results) {
        console.log('   Results count:', json.results.length);
      }
    } catch (e) {
      console.log('   JSON parse failed');
    }
  });
});

req.on('error', (err) => {
  console.log('\n❌ Network error:', err.message);
  console.log('   Code:', err.code);
});

req.setTimeout(10000, () => {
  console.log('\n⏰ Timeout after 10 seconds');
  req.destroy();
});
