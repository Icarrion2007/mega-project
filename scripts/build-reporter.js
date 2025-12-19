// scripts/build-reporter.js
const fs = require('fs');
const path = require('path');
const https = require('https');

class BuildReporter {
  constructor() {
    this.report = {
      project: 'M.E.G.A.',
      timestamp: new Date().toISOString(),
      vercel: {
        present: !!process.env.VERCEL,
        environment: process.env.VERCEL_ENV || 'not_set',
        region: process.env.VERCEL_REGION || 'not_set'
      },
      nodeEnv: process.env.NODE_ENV || 'not_set',
      fecApiKey: {
        present: !!process.env.FEC_API_KEY,
        firstChars: process.env.FEC_API_KEY ? 
          process.env.FEC_API_KEY.substring(0, 6) + '...' : 'not_set',
        length: process.env.FEC_API_KEY ? 
          process.env.FEC_API_KEY.length : 0
      },
      steps: [],
      dataFetch: {},
      finalStatus: 'unknown'
    };
    
    this.reportPath = path.join(__dirname, '../public/build-report.json');
  }

  logStep(step, status, details = {}) {
    const entry = {
      step,
      status,
      timestamp: new Date().toISOString(),
      details
    };
    this.report.steps.push(entry);
    console.log(`📊 [BuildReporter] ${step}: ${status}`);
    if (Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  async testFecApi() {
    if (!process.env.FEC_API_KEY) {
      this.logStep('fec_api_test', 'skipped', { reason: 'No API key present' });
      this.report.dataFetch.testResult = 'skipped_no_key';
      return;
    }

    this.logStep('fec_api_test', 'starting');
    
    // Test the FEC API with a simple request
    return new Promise((resolve) => {
      const testUrl = `https://api.open.fec.gov/v1/candidates/?api_key=${process.env.FEC_API_KEY}&page=1&per_page=1`;
      
      const req = https.get(testUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const testResult = {
              httpStatus: res.statusCode,
              apiResponse: parsed.pagination ? 'valid' : 'unexpected_format',
              count: parsed.pagination?.count || 0,
              apiUrl: testUrl.replace(process.env.FEC_API_KEY, 'API_KEY_REDACTED')
            };
            
            if (res.statusCode === 200 && parsed.pagination) {
              this.logStep('fec_api_test', 'success', testResult);
              this.report.dataFetch.testResult = 'success';
              this.report.dataFetch.details = testResult;
            } else {
              this.logStep('fec_api_test', 'failed', testResult);
              this.report.dataFetch.testResult = 'failed';
              this.report.dataFetch.error = parsed;
            }
          } catch (e) {
            this.logStep('fec_api_test', 'parse_error', { error: e.message });
            this.report.dataFetch.testResult = 'parse_error';
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        this.logStep('fec_api_test', 'network_error', { error: error.message });
        this.report.dataFetch.testResult = 'network_error';
        this.report.dataFetch.error = error.message;
        resolve();
      });

      req.setTimeout(10000, () => {
        req.destroy();
        this.logStep('fec_api_test', 'timeout', { timeoutMs: 10000 });
        this.report.dataFetch.testResult = 'timeout';
        resolve();
      });
    });
  }

  async executeDataFetch() {
    this.logStep('execute_data_fetch', 'starting');
    
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      const { stdout, stderr } = await execPromise('node scripts/fetch-money-trail.js', {
        timeout: 30000
      });
      
      const result = {
        executed: true,
        stdoutLength: stdout.length,
        stderrLength: stderr.length,
        stdoutPreview: stdout.substring(0, 500),
        hasErrors: stderr.length > 0
      };
      
      this.logStep('execute_data_fetch', 'completed', result);
      this.report.dataFetch.execution = result;
      
      // Verify the data file was created/updated
      const dataPath = path.join(__dirname, '../src/data/moneyTrail.json');
      if (fs.existsSync(dataPath)) {
        const stats = fs.statSync(dataPath);
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const fileInfo = {
          exists: true,
          size: stats.size,
          records: data.results?.length || 0,
          totalAmount: data._mega_metadata?.total_amount || 0,
          datasetType: data._mega_metadata?.dataset_type || 'unknown'
        };
        this.logStep('verify_data_file', 'success', fileInfo);
        this.report.dataFetch.resultFile = fileInfo;
        
        if (data._mega_metadata?.dataset_type === 'FEC_CAMPAIGN_CONTRIBUTIONS') {
          this.report.finalStatus = 'success_real_data';
        } else if (data._mega_metadata?.dataset_type === 'EDUCATIONAL_EXAMPLE') {
          this.report.finalStatus = 'success_fallback_data';
        } else {
          this.report.finalStatus = 'success_unknown_data';
        }
      } else {
        this.logStep('verify_data_file', 'failed', { error: 'File not found' });
        this.report.dataFetch.resultFile = { exists: false };
        this.report.finalStatus = 'no_data_file';
      }
      
    } catch (error) {
      this.logStep('execute_data_fetch', 'failed', { 
        error: error.message,
        code: error.code
      });
      this.report.dataFetch.execution = { 
        executed: false, 
        error: error.message 
      };
      this.report.finalStatus = 'fetch_execution_failed';
    }
  }

  async run() {
    this.logStep('build_reporter', 'started');
    
    // Ensure public directory exists
    const publicDir = path.dirname(this.reportPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    await this.testFecApi();
    await this.executeDataFetch();
    
    this.logStep('build_reporter', 'writing_report');
    
    // Write the report
    fs.writeFileSync(this.reportPath, JSON.stringify(this.report, null, 2));
    console.log(`📄 Build report written to: ${this.reportPath}`);
    
    // Also write a human-readable version
    const humanPath = path.join(__dirname, '../public/build-report.txt');
    const humanReport = this.createHumanReport();
    fs.writeFileSync(humanPath, humanReport);
    console.log(`📝 Human-readable report: ${humanPath}`);
    
    this.logStep('build_reporter', 'complete', { 
      reportUrl: '/build-report.json',
      finalStatus: this.report.finalStatus 
    });
    
    return this.report;
  }

  createHumanReport() {
    const lines = [];
    lines.push('='.repeat(60));
    lines.push('M.E.G.A. BUILD REPORT');
    lines.push('='.repeat(60));
    lines.push(`Timestamp: ${this.report.timestamp}`);
    lines.push(`Environment: ${this.report.vercel.environment}`);
    lines.push(`Node Env: ${this.report.nodeEnv}`);
    lines.push(`FEC API Key: ${this.report.fecApiKey.present ? 'PRESENT' : 'MISSING'}`);
    if (this.report.fecApiKey.present) {
      lines.push(`Key Preview: ${this.report.fecApiKey.firstChars}`);
    }
    lines.push('');
    lines.push('BUILD STEPS:');
    lines.push('-' .repeat(40));
    
    this.report.steps.forEach(step => {
      lines.push(`${step.timestamp} - ${step.step}: ${step.status}`);
    });
    
    lines.push('');
    lines.push('DATA FETCH RESULTS:');
    lines.push('-' .repeat(40));
    
    if (this.report.dataFetch.testResult) {
      lines.push(`API Test: ${this.report.dataFetch.testResult}`);
      if (this.report.dataFetch.details) {
        lines.push(`  HTTP Status: ${this.report.dataFetch.details.httpStatus}`);
        lines.push(`  API Response: ${this.report.dataFetch.details.apiResponse}`);
        lines.push(`  Record Count: ${this.report.dataFetch.details.count}`);
      }
    }
    
    if (this.report.dataFetch.resultFile) {
      lines.push('');
      lines.push('DATA FILE:');
      lines.push(`  Exists: ${this.report.dataFetch.resultFile.exists ? 'Yes' : 'No'}`);
      if (this.report.dataFetch.resultFile.exists) {
        lines.push(`  Size: ${this.report.dataFetch.resultFile.size} bytes`);
        lines.push(`  Records: ${this.report.dataFetch.resultFile.records}`);
        lines.push(`  Total: $${this.report.dataFetch.resultFile.totalAmount}`);
        lines.push(`  Type: ${this.report.dataFetch.resultFile.datasetType}`);
      }
    }
    
    lines.push('');
    lines.push('FINAL STATUS:');
    lines.push('-' .repeat(40));
    lines.push(this.report.finalStatus.toUpperCase());
    lines.push('');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }
}

// Run if called directly
if (require.main === module) {
  const reporter = new BuildReporter();
  reporter.run().catch(error => {
    console.error('Build reporter failed:', error);
    process.exit(1);
  });
}

module.exports = BuildReporter;