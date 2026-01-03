// Script 1: Test a minimal, stable API call
require('dotenv').config({ path: '.env.development' });
const axios = require('axios');

const API_KEY = process.env.CONGRESS_API_KEY;
const API_URL = 'https://api.congress.gov/v3/bill';

(async () => {
  console.log('🔍 Running Minimal Parameter Test...\n');

  // Test 1: The absolute simplest call
  console.log('Test 1: No extra parameters');
  try {
    const response = await axios.get(API_URL, {
      params: { format: 'json', api_key: API_KEY, limit: 3 }
    });
    console.log(`✅ Status: ${response.status}`);
    console.log(`   Bills returned: ${response.data.bills?.length || 0}`);
    if (response.data.bills?.[0]) console.log(`   Sample Title: "${response.data.bills[0].title}"\n`);
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    if (error.response) console.log(`   Server Status: ${error.response.status}\n`);
  }

  // Test 2: Add 'congress' parameter
  console.log('Test 2: Adding "congress=118"');
  try {
    const response = await axios.get(API_URL, {
      params: { format: 'json', api_key: API_KEY, limit: 3, congress: 118 }
    });
    console.log(`✅ Status: ${response.status}`);
    console.log(`   Bills returned: ${response.data.bills?.length || 0}\n`);
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    if (error.response) console.log(`   Server Status: ${error.response.status}\n`);
  }

})();