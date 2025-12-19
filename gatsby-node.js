// gatsby-node.js
const BuildReporter = require('./scripts/build-reporter');

exports.onPreBuild = async ({ reporter }) => {
  // Initialize the build reporter
  const buildReporter = new BuildReporter();
  
  // Run the reporter (this will test API, fetch data, and create reports)
  const report = await buildReporter.run();
  
  // Report to Gatsby's system too
  reporter.info(`M.E.G.A. Build completed with status: ${report.finalStatus}`);
  
  if (report.finalStatus === 'success_real_data') {
    reporter.info('✅ Real FEC data loaded successfully!');
  } else if (report.finalStatus === 'success_fallback_data') {
    reporter.warn('⚠️ Using fallback data - FEC API may not be configured');
  } else {
    reporter.error(`❌ Build issue detected: ${report.finalStatus}`);
  }
};