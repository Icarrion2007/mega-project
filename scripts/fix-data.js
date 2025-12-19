const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING CORRUPTED DATA FILE');
const dataPath = path.join(__dirname, '../src/data/moneyTrail.json');

const cleanData = {
  api_version: "v1",
  results: [
    {
      contributor_name: "Example Mega-Donor",
      contribution_receipt_amount: 1000000,
      contributor_occupation: "Philanthropist",
      contribution_receipt_date: "2024-01-01",
      committee_name: "M.E.G.A. Project • DC"
    }
  ],
  _mega_metadata: {
    total_amount: 1000000,
    average_amount: 1000000,
    max_amount: 1000000,
    record_count: 1,
    dataset_type: "CLEAN_DATA",
    description: "Clean example data",
    last_updated: new Date().toISOString()
  }
};

fs.writeFileSync(dataPath, JSON.stringify(cleanData, null, 2));
console.log('✅ Created clean data file with 1 record, $1,000,000 total');
