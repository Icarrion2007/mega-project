// File: gatsby-node.js
const path = require('path');
const fetchMoneyTrail = require('./scripts/fetch-money-trail');

exports.onPreBuild = async ({ reporter }) => {
  reporter.info('🔄 M.E.G.A.: Activating Big Money data pipeline...');
  
  try {
    const data = await fetchMoneyTrail();
    
    if (data && data._mega_metadata) {
      reporter.success(`✅ Loaded ${data._mega_metadata.total_contributions} contributions`);
      reporter.info(`💰 Total: $${data._mega_metadata.total_amount.toLocaleString()}`);
      reporter.info(`🏆 Largest: $${data._mega_metadata.biggest_donation.toLocaleString()}`);
    } else {
      reporter.warn('⚠️ Data loaded but metadata missing');
    }
    
  } catch (error) {
    reporter.error('❌ Data pipeline failed:', error);
    reporter.info('🔄 Falling back to educational data...');
  }
  
  reporter.success('🎯 M.E.G.A.: Data pipeline complete');
};

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  try {
    const moneyTrailData = require('./src/data/moneyTrail.json');
    
    console.log(`📊 Creating GraphQL nodes from ${moneyTrailData.results.length} contributions...`);
    
    // Create nodes for each contribution WITH PARTY FIELD
    moneyTrailData.results.forEach((contribution, index) => {
      const nodeData = {
        id: createNodeId(`contribution-${index}`),
        candidate: contribution.candidate || 'Unknown',
        contributor: contribution.contributor || 'Anonymous',
        amount: contribution.amount || 0,
        date: contribution.date || '2024-01-01',
        employer: contribution.employer || 'Not Disclosed',
        location: contribution.location || 'Unknown',
        committee: contribution.committee || 'Unknown Committee',
        type: contribution.type || 'individual',
        party: contribution.party || 'Unknown', // ADDED PARTY FIELD
        percentage: contribution.percentage || '0',
        normalized: contribution.normalized || 0,
      };
      
      const node = {
        ...nodeData,
        parent: null,
        children: [],
        internal: {
          type: 'MoneyTrail',
          contentDigest: createContentDigest(nodeData),
        },
      };
      
      createNode(node);
    });
    
    // Create metadata node WITH ENHANCED FIELDS
    if (moneyTrailData._mega_metadata) {
      const metadataNode = {
        id: createNodeId('money-trail-metadata'),
        total_amount: moneyTrailData._mega_metadata.total_amount,
        average_amount: moneyTrailData._mega_metadata.average_amount,
        biggest_donation: moneyTrailData._mega_metadata.biggest_donation,
        total_contributions: moneyTrailData._mega_metadata.total_contributions,
        data_source: moneyTrailData._mega_metadata.data_source,
        timestamp: moneyTrailData._mega_metadata.timestamp,
        parties_present: moneyTrailData._mega_metadata.parties_present || [], // ADDED
        enhanced: moneyTrailData._mega_metadata.enhanced || false, // ADDED
        note: moneyTrailData._mega_metadata.note || '', // ADDED
        parent: null,
        children: [],
        internal: {
          type: 'MoneyTrailMetadata',
          contentDigest: createContentDigest(moneyTrailData._mega_metadata),
        },
      };
      
      createNode(metadataNode);
      console.log('✅ Created GraphQL nodes with enhanced fields');
    }
    
  } catch (error) {
    console.error('❌ Failed to create GraphQL nodes:', error);
  }
};

// Optional: Create GraphQL schema type definitions
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MoneyTrail implements Node {
      id: ID!
      candidate: String
      contributor: String
      amount: Float
      date: Date @dateformat
      employer: String
      location: String
      committee: String
      type: String
      party: String
      percentage: String
      normalized: Float
    }
    
    type MoneyTrailMetadata implements Node {
      id: ID!
      total_amount: Float
      average_amount: Float
      biggest_donation: Float
      total_contributions: Int
      data_source: String
      timestamp: Date @dateformat
      parties_present: [String]
      enhanced: Boolean
      note: String
    }
  `;
  createTypes(typeDefs);
};