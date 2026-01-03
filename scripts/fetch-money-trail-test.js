const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../src/data/moneyTrail.json');

// Use ONLY the educational dataset from your code
const fallbackData = {
  "api_version": "1.0",
  "pagination": { "per_page": 50, "pages": 1, "count": 10 },
  "results": [
    {
      "committee": {
        "name": "FUTURE FORWARD USA ACTION",
        "committee_type_full": "Hybrid PAC",
        "organization_type_full": "Nonqualified",
        "treasurer_name": "JOHN DOE",
        "cycles": [2022, 2024]
      },
      "contribution_receipt_amount": 90000000,
      "contributor_name": "Major Donor",
      "committee_name": "FF PAC",
      "committee_type_full": "Hybrid PAC (with Non-Contribution Account) - Nonqualified"
    },
    {
      "committee": {
        "name": "HARRIS VICTORY FUND", 
        "committee_type_full": "Presidential",
        "organization_type_full": "Qualified",
        "treasurer_name": "JANE SMITH",
        "cycles": [2024]
      },
      "contribution_receipt_amount": 85000000,
      "contributor_name": "Political Action Committee",
      "committee_name": "HARRIS FOR PRESIDENT",
      "committee_type_full": "Presidential"
    }
  ],
  "_mega_metadata": {
    "version": "4.1",
    "fetch_date": new Date().toISOString().split('T')[0],
    "data_status": "EDUCATIONAL_ENHANCED",
    "note": "Educational dataset - JSON validated and clean"
  }
};

fs.writeFileSync(outputPath, JSON.stringify(fallbackData, null, 2));
console.log('✅ Created CLEAN educational dataset for testing');
