// scripts/fetch-money-trail.js
require('dotenv').config({ path: '.env.development' });
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs').promises;
const path = require('path');

const API_KEY = process.env.FEC_API_KEY;
const BASE_URL = 'https://api.open.fec.gov/v1';

async function fetchRecentContributions() {
  // Using the /candidates endpoint for initial test - it's simple and reliable
  const endpoint = `${BASE_URL}/candidates/`;
  const params = new URLSearchParams({
    api_key: API_KEY,
    per_page: '5', // Get just a few for testing
    sort: 'name', // A simple, common sort field
    office: 'P' // Filter for Presidential candidates to reduce data
  });

  console.log(`Testing FEC API with endpoint: ${endpoint}`);
  console.log(`Using API Key (last 4 chars): ...${API_KEY ? API_KEY.slice(-4) : 'NOT FOUND'}`);

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`);
    const responseText = await response.text(); // Get raw response first
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // Log the full error response from the server
      console.error('❌ FEC API Error Response Body:');
      console.error(responseText);
      throw new Error(`FEC API error: ${response.status} ${response.statusText}`);
    }
    
    // Try to parse the successful JSON
    const data = JSON.parse(responseText);
    
    // Format the data for our use
    const formattedData = {
      fetched_at: new Date().toISOString(),
      source: 'Federal Election Commission (FEC)',
      endpoint: '/candidates/',
      note: 'Initial test query with Presidential candidates',
      results: data.results.map(candidate => ({
        name: candidate.name,
        office: candidate.office_full,
        party: candidate.party_full,
        state: candidate.state,
        election_years: candidate.election_years,
        candidate_id: candidate.candidate_id
      }))
    };
    
    // Ensure the data directory exists
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'moneyTrail.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Write the formatted data
    await fs.writeFile(outputPath, JSON.stringify(formattedData, null, 2));
    console.log(`\n✅ SUCCESS! Fetched ${formattedData.results.length} candidates.`);
    console.log(`Data saved to: ${outputPath}`);
    console.log('\nSample of data fetched:');
    formattedData.results.slice(0, 2).forEach((candidate, i) => {
      console.log(`  ${i+1}. ${candidate.name} (${candidate.party}, ${candidate.state})`);
    });
    
    return true;
    
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR in FEC API call:');
    console.error(`Error message: ${error.message}`);
    
    if (error.message.includes('API key') || error.message.includes('403')) {
      console.error('\n🔐 API KEY ISSUE DETECTED.');
      console.error('Possible causes:');
      console.error('1. API key missing from .env.development file');
      console.error('2. API key is invalid or expired');
      console.error('3. API key has incorrect format (check for spaces, quotes)');
      console.error('\nCheck your .env.development file contains exactly:');
      console.error('FEC_API_KEY=your_actual_key_here_with_no_quotes');
    }
    
    // Write fallback data
    await writeFallbackData();
    return false;
  }
}

async function writeFallbackData() {
  const fallbackData = {
    fetched_at: new Date().toISOString(),
    source: 'FALLBACK DATA - FEC API Unavailable',
    note: 'The FEC API could not be reached. This is placeholder data.',
    diagnostic: 'Check: 1) API key in .env.development, 2) FEC API status, 3) Network connection',
    results: [
      { name: "Placeholder Candidate A", office: "President", party: "Demo Party", state: "CA", candidate_id: "PLACEHOLDER1" },
      { name: "Placeholder Candidate B", office: "President", party: "Test Party", state: "NY", candidate_id: "PLACEHOLDER2" }
    ]
  };
  
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'moneyTrail.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(fallbackData, null, 2));
  console.log('⚠️  Wrote fallback data to prevent build failure.');
  console.log(`Fallback data path: ${outputPath}`);
}

// Execute
console.log('='.repeat(60));
console.log('M.E.G.A. Project - FEC Data Pipeline Test');
console.log('='.repeat(60));
fetchRecentContributions();