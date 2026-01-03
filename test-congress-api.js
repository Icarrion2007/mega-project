require('dotenv').config({ path: '.env.development' });
const axios = require('axios');

const API_KEY = process.env.CONGRESS_API_KEY;
console.log('Testing Congress.gov API with different parameters...\n');

const testCases = [
  { desc: 'Simple bill list', params: { format: 'json', api_key: API_KEY, limit: 5 } },
  { desc: '118th Congress bills', params: { format: 'json', api_key: API_KEY, limit: 5, congress: 118 } },
  { desc: 'Recent bills', params: { format: 'json', api_key: API_KEY, limit: 5, sort: 'updateDate+desc' } },
  { desc: 'Without congress parameter', params: { format: 'json', api_key: API_KEY, limit: 5, sort: 'updateDate+desc', offset: 0 } }
];

async function runTests() {
  for (const test of testCases) {
    console.log(`Testing: ${test.desc}`);
    console.log(`Params: ${JSON.stringify(test.params)}`);
    
    try {
      // Remove api_key from params for logging (don't expose key)
      const logParams = { ...test.params };
      delete logParams.api_key;
      
      const response = await axios.get('https://api.congress.gov/v3/bill', {
        params: test.params,
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`   Bills: ${response.data.bills?.length || 0}`);
      if (response.data.bills?.[0]) {
        console.log(`   Sample: ${response.data.bills[0].title?.substring(0, 60)}...`);
      }
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}...`);
      }
      console.log('');
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

runTests();
