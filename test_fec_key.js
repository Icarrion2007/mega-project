require('dotenv').config();

const FEC_API_KEY = process.env.FEC_API_KEY;

console.log('🔍 M.E.G.A. API Key Diagnostic');
console.log('=' .repeat(40));

if (!FEC_API_KEY) {
  console.log('❌ ERROR: FEC_API_KEY is undefined or empty');
  console.log('   Check .env.development file format:');
  console.log('   Should be: FEC_API_KEY=your_key_here');
  process.exit(1);
}

console.log('✅ Key found in .env.development');
console.log(`   Key length: ${FEC_API_KEY.length} characters`);

// Test with the candidates endpoint (usually works with basic keys)
const testUrl = `https://api.open.fec.gov/v1/candidates/?api_key=${FEC_API_KEY}&per_page=2`;

console.log('\n📡 Testing FEC API connection...');
console.log(`   Endpoint: /v1/candidates/`);

fetch(testUrl)
  .then(response => {
    console.log(`   HTTP Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 403) {
      console.log('❌ 403 Forbidden: API key is invalid or expired');
      console.log('   Get a new key from: https://api.data.gov/signup/');
      return;
    }
    
    if (response.status === 429) {
      console.log('⚠️  429 Too Many Requests: Rate limit exceeded');
      console.log('   Wait a few minutes and try again');
      return;
    }
    
    if (response.ok) {
      return response.json();
    }
    
    console.log(`❌ Unexpected error: ${response.status}`);
    return null;
  })
  .then(data => {
    if (data) {
      console.log('✅ API Key is VALID!');
      console.log(`   Found ${data.pagination?.count || 'unknown'} records`);
      console.log('\n🎯 Next step: Test /schedules/schedule_a/ endpoint');
    }
  })
  .catch(error => {
    console.log('❌ Network/JavaScript error:', error.message);
    console.log('   This might be a "fetch is not defined" error.');
    console.log('   Run: npm install node-fetch');
  });
