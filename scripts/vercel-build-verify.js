console.log('=== VERIFICATION START ===');
console.log('Node Version:', process.version);
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('FEC_API_KEY present:', !!process.env.FEC_API_KEY);
console.log('Directory:', process.cwd());

// List files to verify build structure
const fs = require('fs');
const files = [
  'package.json',
  'gatsby-config.js',
  'gatsby-node.js',
  'scripts/fetch-money-trail.js',
  'src/data/moneyTrail.json'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('=== VERIFICATION END ===');

// Exit with success
process.exit(0);
