// gatsby-node.js - Minimal working version
exports.onPreBuild = () => {
  console.log('M.E.G.A.: Build hook active.');
  return Promise.resolve();
};
// VERCEL BUILD VERIFICATION
exports.onPreInit = ({ reporter }) => {
  reporter.info('🔧 M.E.G.A. Vercel Build Verification');
  reporter.info(`Build Timestamp: ${new Date().toISOString()}`);
  reporter.info(`Git Branch: ${process.env.VERCEL_GIT_COMMIT_REF || 'unknown'}`);
  reporter.info(`Commit: ${process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'}`);
  
  // Force execution of data fetch
  if (process.env.FEC_API_KEY) {
    reporter.info('✅ FEC_API_KEY is SET');
  } else {
    reporter.warn('⚠️ FEC_API_KEY is NOT SET - using fallback data');
  }
};

// Ensure data fetch runs BEFORE build
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-javascript') {
    const { execSync } = require('child_process');
    try {
      console.log('🚀 Executing FEC data fetch...');
      const output = execSync('node scripts/fetch-money-trail.js', { encoding: 'utf8' });
      console.log('✅ Data fetch successful:', output.substring(0, 200));
    } catch (error) {
      console.log('⚠️ Data fetch failed, using fallback:', error.message);
    }
  }
};
