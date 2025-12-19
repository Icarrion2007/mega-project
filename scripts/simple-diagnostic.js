const https = require('https');
const fs = require('fs');

console.log('🔍 SIMPLE M.E.G.A. DIAGNOSTIC');
console.log('='.repeat(50));

// Check deployed site
https.get('https://www.the-mega-project.org/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\n1. DEPLOYED SITE:');
    console.log('─'.repeat(30));
    console.log('Status:', res.statusCode);
    
    // Check Gatsby version
    const match = data.match(/Gatsby (\d+\.\d+\.\d+)/);
    console.log('Gatsby:', match ? match[1] : 'Not found');
    
    // Check for components
    console.log('Has Triangulation:', data.includes('Triangulation') ? '✅' : '❌');
    console.log('Has QuickStats:', data.includes('QuickStats') ? '✅' : '❌');
    
    // Check data
    console.log('\n2. DATA CHECK:');
    console.log('─'.repeat(30));
    
    // Check local data file
    if (fs.existsSync('src/data/moneyTrail.json')) {
      const localData = JSON.parse(fs.readFileSync('src/data/moneyTrail.json', 'utf8'));
      console.log('Local file:', localData._mega_metadata?.record_count || 0, 'records');
      console.log('Total:', '$' + (localData._mega_metadata?.total_amount || 0));
    } else {
      console.log('Local data file not found');
    }
    
    // Check package.json
    console.log('\n3. BUILD CONFIG:');
    console.log('─'.repeat(30));
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      console.log('Gatsby version:', pkg.dependencies?.gatsby);
      console.log('Build script:', pkg.scripts?.build || 'Not found');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Diagnostic complete');
  });
}).on('error', (err) => {
  console.log('Error checking site:', err.message);
});
