// scripts/test-verification.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

console.log('🔍 M.E.G.A. BUILD VERIFICATION - LOCAL TEST');
console.log('='.repeat(60));

async function runTest() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    checks: []
  };

  // Check 1: Environment Variables
  console.log('\n1. CHECKING ENVIRONMENT:');
  console.log('─'.repeat(40));
  
  const hasFecKey = !!process.env.FEC_API_KEY;
  results.checks.push({
    check: 'FEC_API_KEY present',
    passed: hasFecKey,
    details: hasFecKey ? 
      `Key exists (${process.env.FEC_API_KEY.substring(0, 10)}...)` : 
      'Not found in environment'
  });
  
  console.log(`FEC_API_KEY: ${hasFecKey ? '✅ PRESENT' : '❌ MISSING'}`);
  if (hasFecKey) {
    console.log(`Preview: ${process.env.FEC_API_KEY.substring(0, 10)}...`);
  }

  // Check 2: Test FEC API Connection
  console.log('\n2. TESTING FEC API CONNECTION:');
  console.log('─'.repeat(40));
  
  if (!hasFecKey) {
    console.log('Skipping - no API key available');
    results.checks.push({
      check: 'FEC API test',
      passed: false,
      details: 'Skipped - no API key'
    });
  } else {
    try {
      const testUrl = `https://api.open.fec.gov/v1/candidates/?api_key=${process.env.FEC_API_KEY}&page=1&per_page=1`;
      const response = await new Promise((resolve, reject) => {
        https.get(testUrl, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
      });
      
      const parsed = JSON.parse(response.data);
      const apiWorks = response.status === 200 && parsed.pagination;
      
      results.checks.push({
        check: 'FEC API test',
        passed: apiWorks,
        details: {
          statusCode: response.status,
          hasPagination: !!parsed.pagination,
          count: parsed.pagination?.count || 0
        }
      });
      
      console.log(`API Status: ${response.status}`);
      console.log(`Valid Response: ${apiWorks ? '✅ YES' : '❌ NO'}`);
      if (parsed.pagination) {
        console.log(`Total Records: ${parsed.pagination.count}`);
      }
      
    } catch (error) {
      results.checks.push({
        check: 'FEC API test',
        passed: false,
        details: `Error: ${error.message}`
      });
      console.log(`API Error: ${error.message}`);
    }
  }

  // Check 3: Test fetch-money-trail.js script
  console.log('\n3. TESTING fetch-money-trail.js SCRIPT:');
  console.log('─'.repeat(40));
  
  try {
    const { stdout, stderr } = await execPromise('node scripts/fetch-money-trail.js', {
      timeout: 15000
    });
    
    const scriptRan = !stderr.includes('Error') && stdout.includes('Data saved');
    results.checks.push({
      check: 'fetch-money-trail.js execution',
      passed: scriptRan,
      details: {
        stdoutLength: stdout.length,
        stderrLength: stderr.length,
        hasErrors: stderr.length > 0
      }
    });
    
    console.log(`Script executed: ${scriptRan ? '✅ YES' : '❌ NO'}`);
    console.log(`Output length: ${stdout.length} chars`);
    if (stderr.length > 0) {
      console.log(`Errors: ${stderr.substring(0, 200)}...`);
    }
    
    // Show key output lines
    const lines = stdout.split('\n').filter(line => 
      line.includes('Records:') || 
      line.includes('Total:') || 
      line.includes('Type:')
    );
    lines.forEach(line => console.log(line));
    
  } catch (error) {
    results.checks.push({
      check: 'fetch-money-trail.js execution',
      passed: false,
      details: `Error: ${error.message}`
    });
    console.log(`Script error: ${error.message}`);
  }

  // Check 4: Verify data file was created
  console.log('\n4. VERIFYING DATA FILE:');
  console.log('─'.repeat(40));
  
  const dataPath = path.join(__dirname, '../src/data/moneyTrail.json');
  if (fs.existsSync(dataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const stats = fs.statSync(dataPath);
      
      results.checks.push({
        check: 'Data file exists and valid',
        passed: true,
        details: {
          size: stats.size,
          records: data.results?.length || 0,
          total: data._mega_metadata?.total_amount || 0,
          type: data._mega_metadata?.dataset_type || 'unknown'
        }
      });
      
      console.log(`File exists: ✅ YES (${stats.size} bytes)`);
      console.log(`Records: ${data.results?.length || 0}`);
      console.log(`Total: $${data._mega_metadata?.total_amount || 0}`);
      console.log(`Type: ${data._mega_metadata?.dataset_type || 'unknown'}`);
      
    } catch (error) {
      results.checks.push({
        check: 'Data file exists and valid',
        passed: false,
        details: `Parse error: ${error.message}`
      });
      console.log(`File exists but invalid: ${error.message}`);
    }
  } else {
    results.checks.push({
      check: 'Data file exists and valid',
      passed: false,
      details: 'File not found'
    });
    console.log('File exists: ❌ NO');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY:');
  console.log('─'.repeat(40));
  
  const passed = results.checks.filter(c => c.passed).length;
  const total = results.checks.length;
  
  results.checks.forEach(check => {
    console.log(`${check.passed ? '✅' : '❌'} ${check.check}`);
  });
  
  console.log(`\n${passed}/${total} checks passed`);
  
  // Save results
  const resultsPath = path.join(__dirname, '../verification-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  return results;
}

// Run the test
runTest().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});