// Phase 3.2: Pattern Recognition Engine
const fs = require('fs');
const path = require('path');
const moneyTrailData = require('../src/data/moneyTrail.json');

const analyzePatterns = (contributions) => {
  if (!contributions || !contributions.results) {
    console.error('No contribution data available');
    return null;
  }

  const results = contributions.results;
  
  // 1. Temporal Analysis - Contribution spikes
  const temporalPatterns = {};
  results.forEach(contrib => {
    if (contrib.date) {
      const date = contrib.date.split('T')[0]; // Get YYYY-MM-DD
      temporalPatterns[date] = (temporalPatterns[date] || 0) + 1;
    }
  });
  
  // Find peak days (top 5)
  const peakDays = Object.entries(temporalPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([date, count]) => ({ date, count }));
  
  // 2. Network Analysis - Common contributors
  const contributorMap = {};
  results.forEach(contrib => {
    const name = contrib.contributor;
    if (name && name !== 'N/A') {
      if (!contributorMap[name]) {
        contributorMap[name] = {
          total: 0,
          count: 0,
          recipients: new Set(),
          maxAmount: 0
        };
      }
      contributorMap[name].total += contrib.amount || 0;
      contributorMap[name].count += 1;
      contributorMap[name].recipients.add(contrib.recipient);
      contributorMap[name].maxAmount = Math.max(contributorMap[name].maxAmount, contrib.amount || 0);
    }
  });
  
  // Find top network hubs (giving to multiple recipients)
  const networkHubs = Object.entries(contributorMap)
    .filter(([_, data]) => data.recipients.size > 1)
    .sort((a, b) => b[1].recipients.size - a[1].recipients.size)
    .slice(0, 10)
    .map(([name, data]) => ({
      name,
      recipients: Array.from(data.recipients),
      totalDonated: data.total,
      contributionCount: data.count
    }));
  
  // 3. Sector Mapping by Occupation/Employer
  const sectorMap = {};
  results.forEach(contrib => {
    const sector = determineSector(contrib.occupation, contrib.employer);
    sectorMap[sector] = sectorMap[sector] || { total: 0, count: 0 };
    sectorMap[sector].total += contrib.amount || 0;
    sectorMap[sector].count += 1;
  });
  
  // 4. Geographic Analysis
  const stateFlow = {};
  results.forEach(contrib => {
    if (contrib.state && contrib.state !== 'N/A') {
      stateFlow[contrib.state] = stateFlow[contrib.state] || { total: 0, count: 0 };
      stateFlow[contrib.state].total += contrib.amount || 0;
      stateFlow[contrib.state].count += 1;
    }
  });
  
  // 5. Recipient Profiling
  const recipientProfiles = {};
  results.forEach(contrib => {
    const recipient = contrib.recipient;
    if (recipient && recipient !== 'N/A') {
      recipientProfiles[recipient] = recipientProfiles[recipient] || {
        total: 0,
        count: 0,
        topContributors: {},
        avgAmount: 0
      };
      recipientProfiles[recipient].total += contrib.amount || 0;
      recipientProfiles[recipient].count += 1;
      
      // Track top contributors to this recipient
      const contributor = contrib.contributor || 'Anonymous';
      recipientProfiles[recipient].topContributors[contributor] = 
        (recipientProfiles[recipient].topContributors[contributor] || 0) + (contrib.amount || 0);
    }
  });
  
  // Calculate averages and sort
  Object.keys(recipientProfiles).forEach(recipient => {
    recipientProfiles[recipient].avgAmount = 
      recipientProfiles[recipient].total / recipientProfiles[recipient].count;
  });
  
  const topRecipients = Object.entries(recipientProfiles)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      avgAmount: data.avgAmount
    }));
  
  return {
    summary: {
      totalContributions: results.length,
      totalAmount: results.reduce((sum, c) => sum + (c.amount || 0), 0),
      averageContribution: results.reduce((sum, c) => sum + (c.amount || 0), 0) / results.length,
      dateRange: {
        start: results.reduce((min, c) => c.date && c.date < min ? c.date : min, results[0]?.date),
        end: results.reduce((max, c) => c.date && c.date > max ? c.date : max, results[0]?.date)
      }
    },
    temporalAnalysis: {
      peakDays,
      dailyAverage: results.length / Object.keys(temporalPatterns).length || 0
    },
    networkAnalysis: {
      hubCount: networkHubs.length,
      topHubs: networkHubs,
      uniqueContributors: Object.keys(contributorMap).length
    },
    sectorAnalysis: sectorMap,
    geographicAnalysis: {
      topStates: Object.entries(stateFlow)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5)
        .map(([state, data]) => ({ state, ...data })),
      stateCount: Object.keys(stateFlow).length
    },
    recipientAnalysis: {
      topRecipients,
      uniqueRecipients: Object.keys(recipientProfiles).length
    }
  };
};

// Helper: Determine sector from occupation/employer
function determineSector(occupation, employer) {
  const sectors = {
    'Finance': ['bank', 'finance', 'investment', 'capital', 'wealth', 'hedge fund', 'private equity'],
    'Technology': ['tech', 'software', 'internet', 'ai', 'data', 'developer', 'engineer'],
    'Healthcare': ['doctor', 'nurse', 'hospital', 'medical', 'pharma', 'healthcare'],
    'Legal': ['lawyer', 'attorney', 'legal', 'law firm'],
    'Real Estate': ['real estate', 'realtor', 'property', 'development'],
    'Education': ['teacher', 'professor', 'university', 'school'],
    'Government': ['government', 'public sector', 'official'],
    'Retired': ['retired'],
    'Homemaker': ['homemaker'],
    'Super PAC': ['future forward', 'pac', 'committee', 'action']  // Added for your $90M sample
  };
  
  const searchStr = `${occupation || ''} ${employer || ''}`.toLowerCase();
  
  for (const [sector, keywords] of Object.entries(sectors)) {
    if (keywords.some(keyword => searchStr.includes(keyword))) {
      return sector;
    }
  }
  
  return 'Other/Unknown';
}

// Execute analysis
console.log('🔍 M.E.G.A. Pattern Recognition Engine - Phase 3.2');
console.log('==============================================');

const analysis = analyzePatterns(moneyTrailData);

if (analysis) {
  console.log('\n📊 SUMMARY STATISTICS:');
  console.log(`Total Contributions: ${analysis.summary.totalContributions.toLocaleString()}`);
  console.log(`Total Amount: $${analysis.summary.totalAmount.toLocaleString()}`);
  console.log(`Average Contribution: $${analysis.summary.averageContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  
  console.log('\n⏰ TEMPORAL PATTERNS:');
  console.log('Peak Contribution Days:');
  analysis.temporalAnalysis.peakDays.forEach(day => {
    console.log(`  ${day.date}: ${day.count} contributions`);
  });
  
  console.log('\n🕸️ NETWORK ANALYSIS:');
  console.log(`Unique Contributors: ${analysis.networkAnalysis.uniqueContributors.toLocaleString()}`);
  console.log('Top Network Hubs (contributing to multiple recipients):');
  analysis.networkAnalysis.topHubs.slice(0, 3).forEach(hub => {
    console.log(`  ${hub.name}: ${hub.recipients.length} recipients, $${hub.totalDonated.toLocaleString()}`);
  });
  
  console.log('\n🏛️ RECIPIENT ANALYSIS:');
  console.log('Top 5 Recipients by Total Amount:');
  analysis.recipientAnalysis.topRecipients.slice(0, 5).forEach(recipient => {
    console.log(`  ${recipient.name}: $${recipient.total.toLocaleString()} (${recipient.count} contributions)`);
  });
  
  console.log('\n📍 GEOGRAPHIC ANALYSIS:');
  console.log('Top 5 States by Contribution Amount:');
  analysis.geographicAnalysis.topStates.forEach(state => {
    console.log(`  ${state.state}: $${state.total.toLocaleString()} (${state.count} contributions)`);
  });
  
  // Save analysis to file
  const outputPath = path.join(__dirname, '../src/data/patternAnalysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`\n✅ Analysis saved to: ${outputPath}`);
} else {
  console.error('❌ Analysis failed - no valid data');
}