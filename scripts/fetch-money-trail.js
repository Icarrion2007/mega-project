const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// LOAD ENVIRONMENT VARIABLES
require('dotenv').config({ path: '.env.development' });

const FEC_API_KEY = process.env.FEC_API_KEY;
const DATA_FILE = path.join(__dirname, '../src/data/moneyTrail.json');

console.log('='.repeat(60));
console.log('M.E.G.A. - REAL FEC DATA TEST');
console.log('='.repeat(60));

console.log('🔑 API Key check:', FEC_API_KEY ? 'PRESENT' : 'MISSING');

if (!FEC_API_KEY) {
  console.log('❌ ERROR: No FEC_API_KEY found');
  console.log('   Make sure .env.development exists in project root');
  process.exit(1);
}

// Test the API
const testUrl = `https://api.open.fec.gov/v1/candidates/?api_key=${FEC_API_KEY}&page=1&per_page=2`;
console.log('📡 Testing API connection...');

fetch(testUrl)
  .then(async (res) => {
    console.log('📊 HTTP Status:', res.status);
    const data = await res.json();
    
    if (res.status === 200 && data.pagination) {
      console.log('✅ API SUCCESS!');
      console.log('   Total records:', data.pagination.count);
      console.log('   Results on page:', data.results?.length || 0);
      
      // Create real data file
      const realData = {
        api_version: "v1",
        results: data.results || [],
        _mega_metadata: {
          total_amount: 1234567, // You would calculate this
          record_count: data.results?.length || 0,
          dataset_type: "REAL_FEC_DATA",
          description: "Real FEC API data",
          last_updated: new Date().toISOString()
        }
      };
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(realData, null, 2));
      console.log(`💾 Saved ${realData.results.length} records to: ${DATA_FILE}`);
      
    } else {
      console.log('❌ API returned unexpected format');
      console.log('Response:', JSON.stringify(data).substring(0, 200));
    }
  })
  .catch(err => {
    console.log('❌ NETWORK ERROR:', err.message);
  });
