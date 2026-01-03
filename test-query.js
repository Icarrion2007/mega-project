// Test if we can query GraphQL nodes
const { GraphQLJSON } = require('graphql-type-json');

console.log('Based on build logs, we know:');
console.log('1. ✅ Gatsby creates MoneyTrail nodes: "Created 2 ENHANCED nodes"');
console.log('2. ✅ Schema is built: "success building schema"');
console.log('3. ❌ StaticQuery fails at runtime');

console.log('\nPossible issues:');
console.log('1. Query fields don\'t match schema');
console.log('2. Component renders before query completes');
console.log('3. Circular dependency in components');
console.log('4. Query syntax error in graphql template literal');

console.log('\nLet\'s examine the exact query in TriangulationPreview.js:');
