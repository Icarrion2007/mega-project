const fetch = require('node-fetch');
const key = 'Dv01bo5bmdfvmAPLvZefHr7o8s0FEodLpjdJhm8J'; // Your key

const url = `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=${key}&per_page=3&two_year_transaction_period=2024`;

console.log('Testing URL:', url);

fetch(url)
  .then(async (res) => {
    console.log('Response:', res.status, res.statusText);
    console.log('Headers:', JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    
    const text = await res.text();
    console.log('\\nFirst 500 chars of response:');
    console.log(text.substring(0, 500));
    
    if (res.ok) {
      try {
        const data = JSON.parse(text);
        console.log('\\n✅ Parsed JSON successfully');
        console.log('Results:', data.results?.length || 0);
      } catch (e) {
        console.log('❌ Failed to parse JSON');
      }
    }
  })
  .catch(err => console.log('Network error:', err));
