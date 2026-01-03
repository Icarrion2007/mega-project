// fix-masterpiece.js - PRECISE NODE.JS SOLUTION
const fs = require('fs');
const path = require('path');

console.log('=== MASTERPIECE PRECISION FIX ===');
console.log('Using Node.js for Windows compatibility');

// 1. RESTORE WORKING GATSBY-NODE.JS
const backupPath = path.join(__dirname, 'gatsby-node.js.backup-1766367579');
const gatsbyNodePath = path.join(__dirname, 'gatsby-node.js');

if (fs.existsSync(backupPath)) {
  console.log('✅ Restoring working backup...');
  fs.copyFileSync(backupPath, gatsbyNodePath);
} else {
  console.log('⚠️ No backup found, checking current...');
}

// 2. VERIFY SYNTAX
console.log('\n=== VERIFYING SYNTAX ===');
try {
  require(gatsbyNodePath);
  console.log('✅ gatsby-node.js syntax is valid');
} catch (error) {
  console.log(`❌ Syntax error: ${error.message}`);
  
  // Create minimal working version
  console.log('Creating minimal working version...');
  const minimalGatsbyNode = `// gatsby-node.js - MINIMAL WORKING VERSION
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

exports.onPreBuild = async ({ reporter }) => {
  reporter.info('M.E.G.A.: Data pipeline...');
  try {
    const { stdout, stderr } = await execPromise('node scripts/fetch-money-trail.js');
    if (stdout) console.log(stdout);
    reporter.success('M.E.G.A.: Data pipeline complete');
  } catch (error) {
    reporter.warn(\`M.E.G.A. failed: \${error.message}\`);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = \`
    type MoneyTrail implements Node {
      id: ID!
      contributor_name: String
      contribution_receipt_amount: Float
      committee_name: String
    }
  \`;
  createTypes(typeDefs);
};

exports.sourceNodes = ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  const dataPath = path.join(__dirname, 'src/data/moneyTrail.json');
  
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.results.forEach((item, index) => {
      const nodeData = {
        id: createNodeId(\`money-trail-\${index}\`),
        contributor_name: item.contributor_name || '',
        contribution_receipt_amount: item.contribution_receipt_amount || 0,
        committee_name: item.committee?.name || item.committee_name || '',
        internal: {
          type: 'MoneyTrail',
          contentDigest: createContentDigest(item)
        }
      };
      createNode(nodeData);
    });
    reporter.info(\`Created \${data.results.length} nodes\`);
  } catch (error) {
    reporter.panic(\`Failed: \${error.message}\`);
  }
};
`;
  
  fs.writeFileSync(gatsbyNodePath, minimalGatsbyNode);
  console.log('✅ Created minimal working gatsby-node.js');
}

// 3. FIX TRIANGULATIONPREVIEW.JS GRAPHQL QUERY
console.log('\n=== FIXING TRIANGULATIONPREVIEW.JS ===');
const triPath = path.join(__dirname, 'src/components/TriangulationPreview.js');

if (fs.existsSync(triPath)) {
  let content = fs.readFileSync(triPath, 'utf8');
  
  // Find and fix GraphQL query (Windows-safe regex)
  const queryMatch = content.match(/const data = useStaticQuery\(graphql`([\s\S]*?)`\)/);
  
  if (queryMatch) {
    const fixedQuery = `const data = useStaticQuery(graphql\`
    query MoneyTrailQuery {
      allMoneyTrail(limit: 10, sort: {contribution_receipt_amount: DESC}) {
        nodes {
          id
          contributor_name
          contribution_receipt_amount
          committee_name
        }
      }
    }
  \`);`;
    
    content = content.replace(/const data = useStaticQuery\(graphql`[\s\S]*?`\)/, fixedQuery);
    fs.writeFileSync(triPath, content);
    console.log('✅ Fixed GraphQL query in TriangulationPreview.js');
  } else {
    console.log('⚠️ Could not find GraphQL query in component');
  }
}

// 4. VERIFY DATA STRUCTURE
console.log('\n=== VERIFYING DATA ===');
const dataPath = path.join(__dirname, 'src/data/moneyTrail.json');

if (fs.existsSync(dataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Data file: ${data.results?.length || 0} records`);
    
    if (data.results && data.results.length > 0) {
      const sample = data.results[0];
      console.log('Sample record has:');
      console.log('  contributor_name:', !!sample.contributor_name);
      console.log('  contribution_receipt_amount:', !!sample.contribution_receipt_amount);
      console.log('  committee.name:', !!(sample.committee && sample.committee.name));
    }
  } catch (error) {
    console.log(`❌ Data error: ${error.message}`);
  }
}

console.log('\n✅ MASTERPIECE FIX COMPLETE');
console.log('Run: node fix-masterpiece.js');