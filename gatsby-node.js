// gatsby-node.js - M.E.G.A. V4.2 + CONGRESS.GOV INTEGRATION
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

exports.onPreBuild = async ({ reporter }) => {
  reporter.info('🔍 M.E.G.A.: Activating Enhanced Data Pipeline V4.2...');

  try {
    // FEC Data Pipeline
    const { stdout, stderr } = await execPromise('node scripts/fetch-money-trail.js');
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    // Congress.gov Data Pipeline (NEW)
   const fetchCongressNarrative = require('./scripts/fetch-congress-narrative_FIXED'); // Changed filename
    await fetchCongressNarrative();
    
    reporter.success('✅ M.E.G.A.: Dual data pipelines (FEC + Congress.gov) complete');
  } catch (error) {
    reporter.warn(`⚠️ M.E.G.A.: Pipeline issues: ${error.message}`);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type MoneyTrail implements Node @dontInfer {
      id: ID!
      candidate: String
      contributor: String
      amount: Float
      date: String
      employer: String
      location: String

      # ENHANCED COMMITTEE METADATA (FULL FEC STRUCTURE)
      committee: JSON
      committee_name: String
      committee_id: String
      committee_type: String
      committee_type_full: String
      committee_type_short: String
      organization_type: String
      organization_type_full: String
      designation: String
      designation_full: String
      treasurer_name: String
      filing_frequency: String
      is_active: Boolean
      first_file_date: String
      last_file_date: String
      cycles_active: [Int]
      cycles_has_activity: [Int]
      cycles_has_financial: [Int]
      cycles_count: Int
      state: String
      state_full: String
      city: String
      zip: String
      street_1: String
      street_2: String

      # M.E.G.A. ANALYSIS FIELDS (V4.2 ENHANCED)
      type: String
      party: String
      party_full: String
      influence_score: Float
      transparency_score: Float
      longevity_score: Float
      accountability_score: Float

      # RAW FEC FIELDS (PRESERVED)
      contribution_receipt_amount: Float
      contribution_receipt_date: String
      contributor_name: String
      contributor_employer: String
      contributor_occupation: String
      contributor_city: String
      contributor_state: String
      contributor_zip: String
      committee_id_raw: String
      report_type: String
      report_year: Int
      schedule_type: String
      two_year_transaction_period: Int
      entity_type: String
      entity_type_desc: String
      receipt_type: String
      receipt_type_full: String
    }

    type MoneyTrailMetadata implements Node {
      id: ID!
      total_amount: Float
      average_amount: Float
      biggest_donation: Float
      total_contributions: Int
      data_source: String
      timestamp: String
      parties_present: [String]
      parties_full_present: [String]
      enhanced: Boolean
    }

    # CONGRESS.GOV NARRATIVE TYPE (NEW - Phase 3.2)
    type CongressNarrative implements Node @dontInfer {
      id: ID!
      bill_id: String
      bill_number: String
      bill_type: String
      congress: Int
      title: String
      introduced_date: String
      latest_action: JSON
      policy_area: String
      sponsor: JSON
      sponsor_name: String
      sponsor_party: String
      sponsor_state: String
      cosponsors: [JSON]
      cosponsor_count: Int
      influence_score: Float
      transparency_score: Float
      progress_score: Float
      donor_state_alignment: String
      status: String
      last_action_date: String
      raw_bill: JSON
    }

    type CongressNarrativeMetadata implements Node {
      id: ID!
      bill_count: Int
      data_source: String
      timestamp: String
      version: String
      triangulation_ready: Boolean
      note: String
    }
  `;
  createTypes(typeDefs);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  
  // ===== PROCESS MONEY TRAIL (EXISTING) =====
  const moneyTrailPath = path.join(__dirname, 'src/data/moneyTrail.json');
  
  try {
    const moneyTrailData = JSON.parse(fs.readFileSync(moneyTrailPath, 'utf8'));
    
    if (moneyTrailData.results && Array.isArray(moneyTrailData.results)) {
      moneyTrailData.results.forEach((item, index) => {
        const committee = item.committee || {};
        const nodeId = createNodeId(`money-trail-${index}`);
        
        const influence_score = calculateInfluenceScore(item, committee);
        const transparency_score = calculateTransparencyScore(item, committee);
        const longevity_score = calculateLongevityScore(committee);
        const accountability_score = calculateAccountabilityScore(item, committee);

        const nodeData = {
          id: nodeId,
          candidate: item.candidate_name || null,
          contributor: item.contributor_name || null,
          amount: item.contribution_receipt_amount || 0,
          date: item.contribution_receipt_date || null,
          employer: item.contributor_employer || null,
          location: item.contributor_city ? `${item.contributor_city}, ${item.contributor_state}` : null,
          
          committee: committee,
          committee_name: committee.name || item.committee_name || null,
          committee_id: committee.committee_id || item.committee_id || null,
          committee_type: committee.committee_type || null,
          committee_type_full: committee.committee_type_full || null,
          committee_type_short: committee.committee_type_short || null,
          organization_type: committee.organization_type || null,
          organization_type_full: committee.organization_type_full || null,
          designation: committee.designation || null,
          designation_full: committee.designation_full || null,
          treasurer_name: committee.treasurer_name || null,
          filing_frequency: committee.filing_frequency || null,
          is_active: committee.is_active || false,
          first_file_date: committee.first_file_date || null,
          last_file_date: committee.last_file_date || null,
          cycles_active: committee.cycles || [],
          cycles_has_activity: committee.cycles_has_activity || [],
          cycles_has_financial: committee.cycles_has_financial || [],
          cycles_count: committee.cycles ? committee.cycles.length : 0,
          state: committee.state || null,
          state_full: committee.state_full || null,
          city: committee.city || null,
          zip: committee.zip || null,
          street_1: committee.street_1 || null,
          street_2: committee.street_2 || null,
          
          type: committee.designation || 'Unknown',
          party: committee.party || null,
          party_full: committee.party_full || null,
          influence_score: influence_score,
          transparency_score: transparency_score,
          longevity_score: longevity_score,
          accountability_score: accountability_score,
          
          contribution_receipt_amount: item.contribution_receipt_amount || 0,
          contribution_receipt_date: item.contribution_receipt_date || null,
          contributor_name: item.contributor_name || null,
          contributor_employer: item.contributor_employer || null,
          contributor_occupation: item.contributor_occupation || null,
          contributor_city: item.contributor_city || null,
          contributor_state: item.contributor_state || null,
          contributor_zip: item.contributor_zip || null,
          committee_id_raw: item.committee_id || null,
          report_type: item.report_type || null,
          report_year: item.report_year || null,
          schedule_type: item.schedule_type || null,
          two_year_transaction_period: item.two_year_transaction_period || null,
          entity_type: item.entity_type || null,
          entity_type_desc: item.entity_type_desc || null,
          receipt_type: item.receipt_type || null,
          receipt_type_full: item.receipt_type_full || null,

          internal: {
            type: 'MoneyTrail',
            contentDigest: createContentDigest(item)
          }
        };

        createNode(nodeData);
      });

      reporter.info(`✅ M.E.G.A. V4.2: Created ${moneyTrailData.results.length} MoneyTrail nodes`);
      
      const moneyTrailMetadata = {
        id: createNodeId('money-trail-metadata'),
        total_amount: moneyTrailData._mega_metadata?.total_amount || 0,
        average_amount: moneyTrailData._mega_metadata?.average_amount || 0,
        biggest_donation: moneyTrailData._mega_metadata?.biggest_donation || 0,
        total_contributions: moneyTrailData.results.length,
        data_source: 'FEC API - Enhanced V4.2',
        timestamp: new Date().toISOString(),
        parties_present: Array.from(new Set(moneyTrailData.results.map(r => r.committee?.party).filter(Boolean))),
        parties_full_present: Array.from(new Set(moneyTrailData.results.map(r => r.committee?.party_full).filter(Boolean))),
        enhanced: true,
        internal: {
          type: 'MoneyTrailMetadata',
          contentDigest: createContentDigest(moneyTrailData._mega_metadata || {})
        }
      };

      createNode(moneyTrailMetadata);
    }
  } catch (error) {
    reporter.error(`❌ MoneyTrail sourceNodes failed: ${error.message}`);
  }

  // ===== PROCESS CONGRESS NARRATIVE (NEW - Phase 3.2) =====
  const congressNarrativePath = path.join(__dirname, 'src/data/congressNarrative.json');
  
  try {
    if (fs.existsSync(congressNarrativePath)) {
      const congressData = JSON.parse(fs.readFileSync(congressNarrativePath, 'utf8'));
      
      if (congressData.results && Array.isArray(congressData.results)) {
        congressData.results.forEach((item, index) => {
          const nodeId = createNodeId(`congress-narrative-${index}`);
          
          const nodeData = {
            id: nodeId,
            bill_id: item.bill_id || null,
            bill_number: item.bill_number || null,
            bill_type: item.bill_type || null,
            congress: item.congress || 118,
            title: item.title || 'Untitled Bill',
            introduced_date: item.introduced_date || null,
            latest_action: item.latest_action || null,
            policy_area: item.policy_area || 'General Legislation',
            sponsor: item.sponsor || null,
            sponsor_name: item.sponsor?.name || null,
            sponsor_party: item.sponsor_party || 'Unknown',
            sponsor_state: item.sponsor_state || 'Unknown',
            cosponsors: item.cosponsors || [],
            cosponsor_count: item.cosponsors?.length || 0,
            influence_score: item.influence_score || 0.5,
            transparency_score: item.transparency_score || 0.7,
            progress_score: item.progress_score || 0.5,
            donor_state_alignment: item.donor_state_alignment || 'Unknown',
            status: item.status || 'Introduced',
            last_action_date: item.last_action_date || item.introduced_date,
            raw_bill: item.raw_bill || item,

            internal: {
              type: 'CongressNarrative',
              contentDigest: createContentDigest(item)
            }
          };

          createNode(nodeData);
        });

        reporter.info(`⚖️  Congress.gov: Created ${congressData.results.length} narrative nodes`);
        
        const congressMetadata = {
          id: createNodeId('congress-narrative-metadata'),
          bill_count: congressData.results.length,
          data_source: congressData._mega_metadata?.source || 'Congress.gov API',
          timestamp: congressData._mega_metadata?.fetch_date || new Date().toISOString(),
          version: congressData._mega_metadata?.version || '1.0',
          triangulation_ready: congressData._mega_metadata?.triangulation_ready || false,
          note: congressData._mega_metadata?.note || 'Official Narrative data',
          internal: {
            type: 'CongressNarrativeMetadata',
            contentDigest: createContentDigest(congressData._mega_metadata || {})
          }
        };

        createNode(congressMetadata);
      }
    } else {
      reporter.warn('⚠️  Congress.gov data file not found. Column 2 will use placeholder.');
    }
  } catch (error) {
    reporter.error(`❌ CongressNarrative sourceNodes failed: ${error.message}`);
  }
};

// ===== ENHANCED M.E.G.A. SCORING FUNCTIONS (EXISTING) =====
function calculateInfluenceScore(item, committee) {
  let score = 0;
  const amount = item.contribution_receipt_amount || 0;
  const amountScore = Math.min(Math.log10(amount + 1) / 7, 1) * 0.4;
  let committeeScore = 0.15;
  if (committee.committee_type === 'Q') committeeScore += 0.15;
  if (committee.designation === 'B') committeeScore += 0.10;
  if (committee.organization_type === 'C') committeeScore += 0.05;
  let geoScore = 0;
  const powerStates = ['DC', 'VA', 'MD', 'NY', 'CA'];
  if (powerStates.includes(committee.state)) geoScore = 0.15;
  else if (committee.state) geoScore = 0.05;
  let activityScore = 0;
  if (committee.cycles_active && committee.cycles_active.length > 0) {
    const activeCount = committee.cycles_active.length;
    activityScore = Math.min(activeCount / 10, 1) * 0.15;
  }
  score = amountScore + committeeScore + geoScore + activityScore;
  return Math.min(Math.max(score, 0.1), 0.95);
}

function calculateTransparencyScore(item, committee) {
  let score = 0.3;
  let donorInfo = 0;
  if (item.contributor_name) donorInfo += 0.1;
  if (item.contributor_employer) donorInfo += 0.1;
  if (item.contributor_occupation) donorInfo += 0.05;
  let committeeDisclosure = 0;
  if (committee.treasurer_name) committeeDisclosure += 0.15;
  if (committee.filing_frequency === 'M') committeeDisclosure += 0.10;
  if (committee.committee_type_full && committee.committee_type_full.includes('Qualified')) committeeDisclosure += 0.10;
  let recencyScore = 0;
  if (committee.last_file_date) {
    const lastFile = new Date(committee.last_file_date);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - lastFile.getFullYear()) * 12 + 
                      (now.getMonth() - lastFile.getMonth());
    recencyScore = Math.max(0, 1 - (monthsDiff / 24)) * 0.20;
  }
  let geoScore = 0;
  if (committee.street_1 && committee.city && committee.state) geoScore = 0.10;
  else if (committee.city && committee.state) geoScore = 0.05;
  score = score + donorInfo + committeeDisclosure + recencyScore + geoScore;
  return Math.min(Math.max(score, 0.2), 0.98);
}

function calculateLongevityScore(committee) {
  if (!committee.cycles || committee.cycles.length === 0) return 0.25;
  const cycles = committee.cycles;
  const cycleCount = cycles.length;
  const historicalDepth = Math.min(cycleCount / 8, 1) * 0.4;
  const currentYear = new Date().getFullYear();
  const recentCycles = cycles.filter(c => c >= currentYear - 4).length;
  const recentActivity = Math.min(recentCycles / 3, 1) * 0.3;
  let continuityScore = 0;
  const sortedCycles = [...cycles].sort((a, b) => a - b);
  let longestStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < sortedCycles.length; i++) {
    if (sortedCycles[i] === sortedCycles[i-1] + 2) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  continuityScore = Math.min(longestStreak / 5, 1) * 0.3;
  return historicalDepth + recentActivity + continuityScore;
}

function calculateAccountabilityScore(item, committee) {
  let score = 0.5;
  if (committee.is_active === false) score -= 0.15;
  if (committee.committee_type === 'T') score += 0.15;
  if (committee.filing_frequency === 'M') score += 0.15;
  else if (committee.filing_frequency === 'Q') score += 0.10;
  else score += 0.05;
  let transparency = 0;
  if (committee.treasurer_name) transparency += 0.10;
  if (committee.organization_type_full && !committee.organization_type_full.includes('Unknown')) transparency += 0.10;
  if (committee.committee_type_full && committee.committee_type_full.includes('PAC')) transparency += 0.05;
  let risk = 0;
  if (committee.last_file_date) {
    const lastFile = new Date(committee.last_file_date);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - lastFile.getFullYear()) * 12 + 
                      (now.getMonth() - lastFile.getMonth());
    if (monthsDiff > 18) risk -= 0.10;
    if (monthsDiff > 36) risk -= 0.10;
  }
  score = score + transparency + risk;
  return Math.min(Math.max(score, 0.15), 0.95);
}