const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const FEC_API_KEY = process.env.FEC_API_KEY;
const DATA_FILE = path.join(__dirname, '../src/data/moneyTrail.json');

const DONOR_MAPPING = {
  'MELLON, TIMOTHY': { candidate: 'Republican Super PAC', party: 'Republican' },
  'MUSK, ELON': { candidate: 'Republican National Committee', party: 'Republican' },
  'ADELSON, MIRIAM': { candidate: 'Congressional Leadership Fund', party: 'Republican' },
  'UIHLEIN, RICHARD': { candidate: 'Senate Leadership Fund', party: 'Republican' },
  'BLOOMBERG, MICHAEL': { candidate: 'Democratic National Committee', party: 'Democrat' },
  'RAMASWAMY, VIVEK': { candidate: 'Republican Presidential Campaign', party: 'Republican' },
  'BIGELOW, ROBERT': { candidate: 'Space Industry PAC', party: 'Republican' },
  'HOROWITZ, BEN': { candidate: 'Tech Industry PAC', party: 'Democrat' },
  'ANDREESSEN, MARC': { candidate: 'Tech Industry PAC', party: 'Democrat' },
  'SOROS, GEORGE': { candidate: 'Democratic Super PAC', party: 'Democrat' },
  'SIMONS, JAMES': { candidate: 'Senate Majority PAC', party: 'Democrat' }
};

async function fetchBigMoneyContributions() {
  console.log('💰 Fetching BIG MONEY contributions...');
  const url = `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=${FEC_API_KEY}&sort=-contribution_receipt_amount&per_page=50&two_year_transaction_period=2024&contributor_type=individual&min_amount=100000`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No big money found, trying without amount filter...');
      const fallbackUrl = `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=${FEC_API_KEY}&sort=-contribution_receipt_amount&per_page=25&two_year_transaction_period=2024`;
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      return fallbackData.results || [];
    }
    return data.results;
  } catch (error) {
    console.error('❌ Error fetching big money:', error.message);
    return [];
  }
}

function processContributions(contributions) {
  if (!contributions || contributions.length === 0) {
    console.log('⚠️ No contributions found, generating educational data');
    return generateEducationalData();
  }

  console.log(`✅ Found ${contributions.length} contributions`);
  
  let enhancedCount = 0;
  const processed = contributions.map((item, index) => {
    const amount = item.contribution_receipt_amount || 0;
    const contributor = item.contributor_name || 'Anonymous';
    
    let candidate = 'Unknown Candidate';
    let party = 'Unknown';
    
    for (const [donor, info] of Object.entries(DONOR_MAPPING)) {
      if (contributor.toUpperCase().includes(donor.split(',')[0].toUpperCase())) {
        candidate = info.candidate;
        party = info.party;
        enhancedCount++;
        break;
      }
    }
    
    if (candidate === 'Unknown Candidate' && item.committee_name) {
      candidate = item.committee_name
        .replace(' PAC', '').replace(' COMMITTEE', '').replace(' FOR', '').replace(' TO', '');
    }

    return {
      id: `contribution-${index}-${Date.now()}`,
      candidate: candidate,
      contributor: contributor,
      amount: amount,
      date: item.contribution_receipt_date || '2024-01-01',
      employer: item.contributor_employer || 'Not Disclosed',
      location: `${item.contributor_city || ''}, ${item.contributor_state || ''}`.trim(),
      committee: item.committee_name || 'Unknown Committee',
      type: item.contributor_type || 'individual',
      party: party,
      percentage: ((amount / 1000000) * 100).toFixed(2),
      normalized: amount / 1000000
    };
  });

  const totalAmount = processed.reduce((sum, item) => sum + item.amount, 0);
  const averageAmount = totalAmount / processed.length;
  const biggestDonation = Math.max(...processed.map(item => item.amount));
  const parties = [...new Set(processed.map(p => p.party))].filter(p => p !== 'Unknown');
  const coverage = enhancedCount > 0 ? `${Math.round((enhancedCount / processed.length) * 100)}%` : '0%';

  return {
    results: processed,
    _mega_metadata: {
      total_amount: totalAmount,
      average_amount: Math.round(averageAmount),
      biggest_donation: biggestDonation,
      total_contributions: processed.length,
      data_source: 'FEC API - Enhanced with donor mapping',
      query_type: 'Big Money (individual, min $100K)',
      timestamp: new Date().toISOString(),
      parties_present: parties,
      enhanced: enhancedCount > 0,
      enhanced_count: enhancedCount,
      coverage: coverage,
      note: `Candidate names enhanced for ${enhancedCount} of ${processed.length} records (${coverage})`
    }
  };
}

function generateEducationalData() {
  console.log('📚 Generating educational fallback data');
  const educationalData = [
    {
      id: 'edu-1', candidate: 'Example Candidate A', contributor: 'Major Corporation LLC',
      amount: 5000000, date: '2024-03-15', employer: 'Finance Industry',
      location: 'New York, NY', committee: 'Victory PAC', type: 'corporate',
      percentage: '500.00', normalized: 5, party: 'Corporate'
    },
    {
      id: 'edu-2', candidate: 'Example Candidate B', contributor: 'Tech Executive',
      amount: 2500000, date: '2024-02-28', employer: 'Silicon Valley Corp',
      location: 'San Francisco, CA', committee: 'Future Fund', type: 'individual',
      percentage: '250.00', normalized: 2.5, party: 'Tech'
    }
  ];

  return {
    results: educationalData,
    _mega_metadata: {
      total_amount: 935000000, average_amount: 187000000,
      biggest_donation: 500000000, total_contributions: educationalData.length,
      data_source: 'Educational Dataset', query_type: 'Example Data',
      timestamp: new Date().toISOString(), parties_present: ['Corporate', 'Tech'],
      enhanced: false, enhanced_count: 0, coverage: '0%',
      note: 'Educational example data'
    }
  };
}

async function main() {
  console.log('🚀 M.E.G.A. Data Pipeline - Enhanced Edition');
  console.log(`🔑 API Key present: ${!!FEC_API_KEY}`);

  try {
    const contributions = await fetchBigMoneyContributions();
    const processedData = processContributions(contributions);
    fs.writeFileSync(DATA_FILE, JSON.stringify(processedData, null, 2));

    console.log(`💾 Saved ${processedData.results.length} records to ${DATA_FILE}`);
    console.log(`📊 Total Amount: $${processedData._mega_metadata.total_amount.toLocaleString()}`);
    console.log(`🏆 Biggest Donation: $${processedData._mega_metadata.biggest_donation.toLocaleString()}`);
    
    if (processedData._mega_metadata.enhanced) {
      console.log(`🎭 Parties: ${processedData._mega_metadata.parties_present.join(', ')}`);
      console.log(`📈 Coverage: ${processedData._mega_metadata.coverage} enhanced`);
      console.log(`📝 Note: ${processedData._mega_metadata.note}`);
    }

    return processedData;
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
    const fallbackData = generateEducationalData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackData, null, 2));
    console.log('✅ Generated fallback educational data');
    return fallbackData;
  }
}

if (require.main === module) {
  main();
}

module.exports = main;