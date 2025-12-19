const https = require('https');
const fs = require('fs');

console.log('🔍 M.E.G.A. QUICK DIAGNOSTIC');
console.log('='.repeat(60));

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', () => resolve({ status: 0, data: '' }));
    });
}

async function runDiagnostic() {
    console.log('\n1. CHECKING DEPLOYED SITE:');
    console.log('─'.repeat(40));
    
    const siteResult = await checkUrl('https://www.the-mega-project.org/');
    
    if (siteResult.status === 200) {
        console.log('✅ Site is accessible');
        
        const gatsbyMatch = siteResult.data.match(/Gatsby (\d+\.\d+\.\d+)/);
        console.log(`   Gatsby version: ${gatsbyMatch ? gatsbyMatch[1] : 'Not detected'}`);
        
        console.log(`   Has "Triangulation": ${siteResult.data.includes('Triangulation') ? '✅' : '❌'}`);
        console.log(`   Has "QuickStats": ${siteResult.data.includes('QuickStats') ? '✅' : '❌'}`);
        
        if (siteResult.data.includes('935,620,000')) {
            console.log('   Data type: 🔴 MOCK DATA ($935M)');
        } else if (siteResult.data.includes('12,134')) {
            console.log('   Data type: 🟢 REAL FEC DATA ($12K)');
        } else {
            console.log('   Data type: ⚠️  UNKNOWN');
        }
    } else {
        console.log(`❌ Site not accessible (HTTP ${siteResult.status})`);
    }
    
    console.log('\n2. CHECKING GITHUB REPOSITORY:');
    console.log('─'.repeat(40));
    
    const githubFiles = [
        'package.json',
        'gatsby-config.js',
        'gatsby-node.js',
        'scripts/fetch-money-trail.js'
    ];
    
    for (const file of githubFiles) {
        const url = `https://raw.githubusercontent.com/Icarrion2007/mega-project/main/${file}`;
        const result = await checkUrl(url);
        
        if (result.status === 200) {
            console.log(`✅ ${file} - accessible`);
            
            if (file === 'package.json') {
                try {
                    const pkg = JSON.parse(result.data);
                    console.log(`   Gatsby dependency: ${pkg.dependencies?.gatsby || 'Not found'}`);
                } catch (e) {
                    console.log('   Could not parse package.json');
                }
            }
        } else {
            console.log(`❌ ${file} - not accessible (HTTP ${result.status})`);
        }
    }
    
    console.log('\n3. LOCAL ENVIRONMENT CHECK:');
    console.log('─'.repeat(40));
    
    const localFiles = [
        'package.json',
        'gatsby-config.js',
        'gatsby-node.js',
        'scripts/fetch-money-trail.js',
        'src/data/moneyTrail.json'
    ];
    
    localFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const size = fs.statSync(file).size;
            console.log(`✅ ${file} (${size} bytes)`);
        } else {
            console.log(`❌ ${file} - not found`);
        }
    });
    
    console.log('\n4. DIAGNOSTIC SUMMARY:');
    console.log('─'.repeat(40));
    
    console.log('💡 RECOMMENDED NEXT STEPS:');
    console.log('   1. If site shows Gatsby 5.15.0 but package.json has Gatsby 4.x:');
    console.log('      → Update package.json to match deployed version');
    console.log('   2. If build is failing:');
    console.log('      → Check Vercel build logs for specific errors');
    console.log('   3. If data is not syncing:');
    console.log('      → Verify FEC_API_KEY is set in Vercel environment variables');
    console.log('   4. If components are missing:');
    console.log('      → Ensure components are imported in index.js');
    
    console.log('\n='.repeat(60));
    console.log('✅ Diagnostic complete');
}

runDiagnostic().catch(error => {
    console.error('Diagnostic failed:', error);
});
