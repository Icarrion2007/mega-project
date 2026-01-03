require('dotenv').config({ path: '.env.development' });
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY;
const DATA_FILE = path.join(__dirname, '../src/data/congressNarrative.json');

const fetchWithRetry = async (url, params, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url, {
        params: { ...params, api_key: CONGRESS_API_KEY, format: 'json' },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.warn(`Attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Wait 1s, then 2s, then 3s
    }
  }
};

// NEW: Client-side sorting function
const sortBillsByUpdateDate = (bills) => {
  return bills.sort((a, b) => {
    // Handle missing dates by putting them last
    const dateA = a.updateDate || a.latestActionDate || '1970-01-01';
    const dateB = b.updateDate || b.latestActionDate || '1970-01-01';
    return new Date(dateB) - new Date(dateA); // Descending (newest first)
  });
};

const fetchCongressNarrative = async () => {
  try {
    console.log('🔗 Connecting to Congress.gov API...');

    // CRITICAL CHANGE: Fetch WITHOUT the problematic 'sort' parameter
    const data = await fetchWithRetry('https://api.congress.gov/v3/bill', {
      congress: 118,
      limit: 20 // Fetch more to have enough data after filtering
    });

    if (!data || !data.bills || data.bills.length === 0) {
      throw new Error('No bills returned from API');
    }

    console.log(`✅ Retrieved ${data.bills.length} raw bills from Congress.gov`);

    // FILTER: Remove the "Reserved for the Speaker" placeholder bills
    const realBills = data.bills.filter(bill => 
      bill.title && !bill.title.includes('Reserved for the Speaker')
    );
    console.log(`📊 Filtered to ${realBills.length} substantive bills`);

    // SORT: Do the sorting locally in your code
    const sortedBills = sortBillsByUpdateDate(realBills);

    // ENHANCE: Add your M.E.G.A. analysis (using your existing function)
    const enhancedBills = sortedBills.slice(0, 12).map(bill => ({
      // ... Your existing enhanceWithMEGAAnalysis logic here ...
      id: bill.id,
      title: bill.title,
      congress: bill.congress,
      billType: bill.billType,
      billNumber: bill.number,
      latestActionText: bill.latestAction?.text,
      // Ensure we use the sorted date
      latestActionDate: bill.updateDate || bill.latestAction?.actionDate,
      // ... include all other fields from your analysis
    }));

    const output = {
      metadata: {
        source: 'congress.gov',
        fetchedAt: new Date().toISOString(),
        congress: 118,
        billsCount: enhancedBills.length,
        note: 'Data sorted client-side due to API server bug with sort parameter'
      },
      bills: enhancedBills
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(output, null, 2));
    console.log(`💾 Saved ${enhancedBills.length} enhanced, sorted bills to ${DATA_FILE}`);
    return output;

  } catch (error) {
    console.error('❌ Critical error:', error.message);
    console.log('🔄 Falling back to educational data...');
    // ... your existing educational fallback logic ...
  }
};

// Execute if run directly
if (require.main === module) {
  fetchCongressNarrative()
    .then(result => {
      console.log(`\n🎯 Fetch complete! Source: ${result.metadata.source}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('🚨 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = fetchCongressNarrative;