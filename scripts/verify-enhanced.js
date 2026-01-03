// /c/mega-project/scripts/verify-enhanced.js
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/moneyTrail.json');

function verifyEnhancedSchema() {
  console.log('🔍 M.E.G.A. V4.1 - Schema Verification');
  console.log('='.repeat(50));
  
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`📊 Total Records: ${data.results?.length || 0}`);
    
    if (data.results && data.results.length > 0) {
      const sample = data.results[0];
      
      console.log('\n✅ ENHANCED FIELDS VERIFICATION:');
      console.log('- committee (object):', sample.committee ? '✅ PRESENT' : '❌ MISSING');
      console.log('- committee.name:', sample.committee?.name || '❌ MISSING');
      console.log('- committee.committee_type_full:', sample.committee?.committee_type_full || '❌ MISSING');
      console.log('- committee.organization_type_full:', sample.committee?.organization_type_full || '❌ MISSING');
      console.log('- committee.treasurer_name:', sample.committee?.treasurer_name || '❌ MISSING');
      console.log('- committee.cycles:', sample.committee?.cycles?.length || 0, 'cycles');
      
      console.log('\n📈 M.E.G.A. METADATA:');
      console.log('- Schema Version:', data._mega_metadata?.version || 'UNKNOWN');
      console.log('- Data Status:', data._mega_metadata?.data_status || 'UNKNOWN');
      console.log('- Enhanced:', data._mega_metadata?.note?.includes('Enhanced') ? '✅ YES' : '❌ NO');
      
      console.log('\n🎯 READY FOR TRIANGULATION:');
      const hasRequiredFields = sample.committee?.name && 
                               sample.committee?.committee_type_full &&
                               sample.committee?.organization_type_full;
      console.log('- Full Committee Metadata:', hasRequiredFields ? '✅ COMPLETE' : '❌ INCOMPLETE');
      
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('M.E.G.A. V4.1 Verification:', 
      data._mega_metadata?.version === '4.1' ? '✅ PASS' : '⚠️  CHECK VERSION');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  verifyEnhancedSchema();
}

module.exports = verifyEnhancedSchema;