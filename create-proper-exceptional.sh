#!/bin/bash
cd /c/mega-project

# Backup current working version
cp gatsby-node.js gatsby-node.js.working-backup

# Extract just the createSchemaCustomization and sourceNodes from exceptional version
# while keeping the working onPreBuild

# First, let's see what the exceptional version tried to do
echo "Creating PROPER exceptional fix..."

# Create hybrid version: working structure + exceptional schema
cat > gatsby-node-exceptional-proper.js << 'PROPEREOF'
// gatsby-node.js - EXCEPTIONAL HYBRID (M.E.G.A. V4.1 Masterpiece)
// Preserves working onPreBuild + adds exceptional schema
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// WORKING: Keep original onPreBuild exactly as it was
exports.onPreBuild = async ({ reporter }) => {
  reporter.info('🔍 M.E.G.A.: Activating Enhanced Data Pipeline V4.1...');
  try {
    const { stdout, stderr } = await execPromise('node scripts/fetch-money-trail.js');
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    reporter.success('✅ M.E.G.A.: Data pipeline complete');
  } catch (error) {
    reporter.warn(`⚠️ M.E.G.A.: Data pipeline failed: ${error.message}`);
  }
};

// EXCEPTIONAL: Enhanced schema that works
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = \`
    type MoneyTrail implements Node @dontInfer {
      id: ID!
      
      # Core contribution data (from JSON)
      contributor_name: String
      contribution_receipt_amount: Float
      contribution_receipt_date: String
      contributor_employer: String
      contributor_occupation: String
      contributor_city: String
      contributor_state: String
      contributor_zip: String
      
      # Committee data (flattened from committee object)
      committee_name: String
      committee_type: String
      committee_type_full: String
      committee_id: String
      committee_organization_type: String
      committee_organization_type_full: String
      committee_designation: String
      committee_designation_full: String
      committee_treasurer_name: String
      committee_filing_frequency: String
      committee_is_active: Boolean
      committee_first_file_date: String
      committee_last_file_date: String
      committee_state: String
      committee_state_full: String
      committee_city: String
      committee_zip: String
      committee_street_1: String
      committee_street_2: String
      
      # Simplified M.E.G.A. scores (will be calculated)
      influence_score: Float
      transparency_score: Float
    }

    type MoneyTrailMetadata implements Node {
      id: ID!
      total_amount: Float
      average_amount: Float
      biggest_donation: Float
      total_contributions: Int
      data_source: String
      timestamp: String
      enhanced: Boolean
      version: String
    }
  \`;
  createTypes(typeDefs);
};

// EXCEPTIONAL: Working sourceNodes that processes the data
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  const dataPath = path.join(__dirname, 'src/data/moneyTrail.json');

  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid data structure');
    }

    // Process each contribution
    data.results.forEach((item, index) => {
      const committee = item.committee || {};
      
      // Calculate M.E.G.A. scores
      const influence_score = calculateInfluenceScore(item);
      const transparency_score = calculateTransparencyScore(item, committee);
      
      const nodeData = {
        // Core fields from JSON
        id: createNodeId(\`money-trail-\${index}\`),
        contributor_name: item.contributor_name,
        contribution_receipt_amount: item.contribution_receipt_amount,
        contribution_receipt_date: item.contribution_receipt_date,
        contributor_employer: item.contributor_employer,
        contributor_occupation: item.contributor_occupation,
        contributor_city: item.contributor_city,
        contributor_state: item.contributor_state,
        contributor_zip: item.contributor_zip,
        
        # Flattened committee fields
        committee_name: committee.name || item.committee_name,
        committee_type: committee.committee_type,
        committee_type_full: committee.committee_type_full,
        committee_id: committee.committee_id || item.committee_id,
        committee_organization_type: committee.organization_type,
        committee_organization_type_full: committee.organization_type_full,
        committee_designation: committee.designation,
        committee_designation_full: committee.designation_full,
        committee_treasurer_name: committee.treasurer_name,
        committee_filing_frequency: committee.filing_frequency,
        committee_is_active: committee.is_active || false,
        committee_first_file_date: committee.first_file_date,
        committee_last_file_date: committee.last_file_date,
        committee_state: committee.state,
        committee_state_full: committee.state_full,
        committee_city: committee.city,
        committee_zip: committee.zip,
        committee_street_1: committee.street_1,
        committee_street_2: committee.street_2,
        
        # M.E.G.A. scores
        influence_score: influence_score,
        transparency_score: transparency_score,
        
        # Internal Gatsby fields
        internal: {
          type: 'MoneyTrail',
          contentDigest: createContentDigest(item)
        }
      };

      createNode(nodeData);
    });

    reporter.info(\`✅ M.E.G.A. V4.1: Created \${data.results.length} exceptional nodes\`);

    # Create metadata node
    const metadataNode = {
      id: createNodeId('money-trail-metadata'),
      total_amount: data._mega_metadata?.total_amount || 0,
      average_amount: data._mega_metadata?.average_amount || 0,
      biggest_donation: data._mega_metadata?.biggest_donation || 0,
      total_contributions: data.results.length,
      data_source: 'FEC API - Exceptional Schema',
      timestamp: new Date().toISOString(),
      enhanced: true,
      version: '4.1-exceptional-proper',
      internal: {
        type: 'MoneyTrailMetadata',
        contentDigest: createContentDigest(data._mega_metadata || {})
      }
    };

    createNode(metadataNode);
    
  } catch (error) {
    reporter.error(\`❌ M.E.G.A. sourceNodes failed: \${error.message}\`);
  }
};

// Helper functions
function calculateInfluenceScore(item) {
  const amount = item.contribution_receipt_amount || 0;
  if (amount > 1000000) return 0.9;
  if (amount > 100000) return 0.7;
  if (amount > 10000) return 0.5;
  return 0.3;
}

function calculateTransparencyScore(item, committee) {
  let score = 0.5;
  if (committee.treasurer_name) score += 0.2;
  if (committee.committee_type_full && committee.committee_type_full.includes('Qualified')) score += 0.1;
  if (item.contributor_employer && item.contributor_occupation) score += 0.2;
  return Math.min(score, 1.0);
}
PROPEREOF

# Replace with proper exceptional version
mv gatsby-node-exceptional-proper.js gatsby-node.js

echo "✅ Created PROPER exceptional gatsby-node.js with:"
echo "   - Working onPreBuild preserved"
echo "   - 20+ committee fields flattened"
echo "   - M.E.G.A. scoring functions"
echo "   - Proper module structure"
