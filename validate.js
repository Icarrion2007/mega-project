// validate.js
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('./src/data/moneyTrail.json', 'utf8'));
  console.log('DATA_VALID: true');
  console.log('TOTAL_AMOUNT: ' + (data.metadata?.total_amount || 'N/A'));
  console.log('CONTRIBUTION_COUNT: ' + (data.contributions?.length || '0'));
  console.log('ENHANCED_COUNT: ' + (data.metadata?.enhanced_count || '0'));
} catch(e) {
  console.log('DATA_VALID: false');
  console.log('ERROR: ' + e.message);
}