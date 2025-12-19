// SIMPLE WORKING FETCHER FOR VERCEL
const fs = require('fs');
const path = require('path');

console.log('🏗️  Building for Vercel...');

const outputPath = path.join(__dirname, '../src/data/moneyTrail.json');

// Create build-safe data (no API calls during build)
const buildData = {
  results: [
    {
      contributor_name: "BUILD ENVIRONMENT",
      contribution_receipt_amount: 1000000,
      contribution_receipt_date: "2024-01-01",
      committee_name: "M.E.G.A. Project",
      contributor_state: "DC",
      note: "Build-time data - real data loads in browser"
    }
  ],
  _mega_metadata: {
    version: '3.1',
    fetch_date: new Date().toISOString().split('T')[0],
    election_cycle: '2024',
    total_amount: 1000000,
    contribution_count: 1,
    average_amount: 1000000,
    data_status: 'BUILD_MODE',
    note: 'Static build data. Real FEC data loads client-side.'
  }
};

fs.writeFileSync(outputPath, JSON.stringify(buildData, null, 2));
console.log('✅ Build data created for Vercel');
