// Load environment variables FIRST
require('dotenv').config({ path: '.env.development' });

console.log('API Key present:', !!process.env.FEC_API_KEY);
console.log('Value preview:', process.env.FEC_API_KEY ? process.env.FEC_API_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('Full key (first 20 chars):', process.env.FEC_API_KEY ? process.env.FEC_API_KEY.substring(0, 20) + '...' : 'NOT SET');
