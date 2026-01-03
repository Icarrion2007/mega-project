require('dotenv').config({ path: '.env.development' });
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY;
const DATA_FILE = path.join(__dirname, '../src/data/congressNarrative.json');

// Enhanced error handling with retries
const fetchWithRetry = async (url, params, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries} to fetch from Congress.gov...`);
      const response = await axios.get(url, {
        params: { ...params, api_key: CONGRESS_API_KEY, format: 'json' },
        timeout: 15000
      });
      return response.data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

// MEGA analysis enhancement
const enhanceWithMEGAAnalysis = (bill) => {
  if (!bill) return null;
  
  return {
    id: bill.id || `congress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: bill.title || 'Untitled Bill',
    congress: bill.congress || 118,
    session: bill.session || 2,
    billType: bill.billType?.toLowerCase() || 'unknown',
    billNumber: bill.billNumber || 'N/A',
    introducedDate: bill.introducedDate || new Date().toISOString().split('T')[0],
    latestActionDate: bill.latestAction?.actionDate || new Date().toISOString().split('T')[0],
    latestActionText: bill.latestAction?.text || 'No recent action',
    sponsor: bill.sponsors?.[0]?.fullName || 'Unknown Sponsor',
    policyArea: bill.policyArea?.name || 'General',
    link: bill.url || `https://congress.gov/bill/${bill.congress || 118}-congress/${bill.billType || 'hr'}/${bill.billNumber || '1'}`,
    // M.E.G.A. Analysis Fields
    narrativeType: determineNarrativeType(bill.title || ''),
    predictedOutcome: predictOutcome(bill),
    complexityScore: calculateComplexity(bill),
    partisanIndicator: estimatePartisanship(bill),
    triangulationNotes: generateTriangulationNotes(bill)
  };
};

const determineNarrativeType = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('appropriat') || titleLower.includes('budget')) return 'Funding & Resource Allocation';
  if (titleLower.includes('act to') || titleLower.includes('reform')) return 'Structural Reform';
  if (titleLower.includes('right') || titleLower.includes('protect')) return 'Rights & Protections';
  if (titleLower.includes('emergency') || titleLower.includes('relief')) return 'Crisis Response';
  return 'Policy Directive';
};

const predictOutcome = (bill) => {
  const type = bill.billType?.toLowerCase();
  const session = parseInt(bill.session) || 2;
  
  // Simple heuristic based on bill type and session
  if (type === 'hr' && session === 2) return 'Moderate Likelihood of Passage';
  if (type === 's' && session === 1) return 'High Likelihood of Passage';
  if (bill.billNumber && parseInt(bill.billNumber) < 100) return 'Priority Legislation';
  return 'Standard Review Process';
};

const calculateComplexity = (bill) => {
  let score = 50; // Base score
  
  if (bill.policyArea?.name) {
    const complexAreas = ['Taxation', 'Healthcare', 'Financial Services'];
    if (complexAreas.includes(bill.policyArea.name)) score += 30;
  }
  
  if (bill.title && bill.title.length > 100) score += 20;
  
  return Math.min(100, score);
};

const estimatePartisanship = (bill) => {
  const neutralKeywords = ['technical', 'administrative', 'naming', 'commemorative'];
  const title = (bill.title || '').toLowerCase();
  
  for (const keyword of neutralKeywords) {
    if (title.includes(keyword)) return 'Bipartisan/Technical';
  }
  
  const partisanKeywords = ['abortion', 'immigration', 'climate', 'tax cut'];
  for (const keyword of partisanKeywords) {
    if (title.includes(keyword)) return 'Partisan';
  }
  
  return 'Mixed/Unclear';
};

const generateTriangulationNotes = (bill) => {
  const notes = [];
  
  if (bill.billType?.toLowerCase() === 'hr') {
    notes.push('House-originated legislation (HR)');
  } else if (bill.billType?.toLowerCase() === 's') {
    notes.push('Senate-originated legislation (S)');
  }
  
  if (bill.congress === 118) {
    notes.push('Current Congress (2023-2024)');
  }
  
  if (bill.sponsors?.[0]) {
    notes.push(`Sponsored by ${bill.sponsors[0].fullName}`);
  }
  
  return notes.length > 0 ? notes.join(' | ') : 'No additional context';
};

// Main fetch function
const fetchCongressNarrative = async () => {
  try {
    console.log('🔗 Connecting to Congress.gov API...');
    
const data = await fetchWithRetry('https://api.congress.gov/v3/bill', {
  congress: 118,
  limit: 10,
  // offset: 0, // <-- REMOVE or COMMENT OUT THIS LINE
  sort: 'updateDate+desc'
});
    
    if (!data || !data.bills || data.bills.length === 0) {
      console.warn('⚠️ No bills returned from API, using educational data');
      return generateEducationalData();
    }
    
    console.log(`✅ Retrieved ${data.bills.length} bills from Congress.gov`);
    
    // Enhance each bill with M.E.G.A. analysis
    const enhancedBills = data.bills
      .map(bill => enhanceWithMEGAAnalysis(bill))
      .filter(bill => bill !== null);
    
    // Ensure we have at least 5 bills
    if (enhancedBills.length < 5) {
      console.warn(`⚠️ Only ${enhancedBills.length} bills enhanced, supplementing with educational data`);
      const educationalBills = generateEducationalData();
      enhancedBills.push(...educationalBills.slice(0, 5 - enhancedBills.length));
    }
    
    // Save to file
    const output = {
      metadata: {
        source: 'congress.gov',
        fetchedAt: new Date().toISOString(),
        congress: 118,
        billsCount: enhancedBills.length
      },
      bills: enhancedBills.slice(0, 10) // Limit to 10 for performance
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(output, null, 2));
    console.log(`💾 Saved ${enhancedBills.length} enhanced bills to ${DATA_FILE}`);
    
    return output;
    
  } catch (error) {
    console.error('❌ Critical error fetching from Congress.gov:', error.message);
    console.log('🔄 Falling back to educational data...');
    return generateEducationalData(true);
  }
};

// Educational data fallback (only used if API fails)
const generateEducationalData = (saveToFile = false) => {
  const educationalBills = [
    {
      id: 'edu-hr1-118',
      title: 'Example: Fiscal Responsibility Act of 2023',
      congress: 118,
      session: 1,
      billType: 'hr',
      billNumber: '3746',
      introducedDate: '2023-05-30',
      latestActionDate: '2023-06-03',
      latestActionText: 'Became Public Law No: 118-5',
      sponsor: 'Speaker of the House',
      policyArea: 'Taxation',
      link: 'https://www.congress.gov/bill/118th-congress/house-bill/3746',
      narrativeType: 'Funding & Resource Allocation',
      predictedOutcome: 'Enacted into Law',
      complexityScore: 85,
      partisanIndicator: 'Bipartisan',
      triangulationNotes: 'Debt ceiling compromise | Mixed sponsorship | Emergency legislation'
    },
    {
      id: 'edu-s222-118',
      title: 'Example: National Defense Authorization Act',
      congress: 118,
      session: 1,
      billType: 's',
      billNumber: '2226',
      introducedDate: '2023-07-11',
      latestActionDate: '2023-12-14',
      latestActionText: 'Conference report filed in House',
      sponsor: 'Senate Armed Services Committee',
      policyArea: 'Armed Forces',
      link: 'https://www.congress.gov/bill/118th-congress/senate-bill/2226',
      narrativeType: 'Structural Reform',
      predictedOutcome: 'High Likelihood of Passage',
      complexityScore: 90,
      partisanIndicator: 'Bipartisan',
      triangulationNotes: 'Annual defense bill | Committee markup | Conference negotiation'
    }
  ];
  
  const output = {
    metadata: {
      source: 'educational_fallback',
      fetchedAt: new Date().toISOString(),
      note: 'Using educational examples due to API failure'
    },
    bills: educationalBills
  };
  
  if (saveToFile) {
    fs.writeFile(DATA_FILE, JSON.stringify(output, null, 2))
      .then(() => console.log('💾 Saved educational data fallback'))
      .catch(err => console.error('Error saving fallback:', err));
  }
  
  return output;
};

// Execute
if (require.main === module) {
  fetchCongressNarrative()
    .then(result => {
      console.log(`🎯 Congress.gov fetch complete: ${result.bills.length} bills processed`);
      console.log(`📊 Source: ${result.metadata.source}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('🚨 Unhandled error in main execution:', error);
      process.exit(1);
    });
}

module.exports = fetchCongressNarrative;
