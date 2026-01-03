// fix-white-text.js
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/components');

// Common fixes for styled-components
const fixComponent = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix common white text patterns
  const fixes = [
    // Replace white backgrounds with M.E.G.A. dark
    [/background:\s*['"]#?fff?f?['"]/gi, "background: '#0A1D3F'"],
    [/background:\s*['"]white['"]/gi, "background: '#0A1D3F'"],
    [/background:\s*#ffffff/gi, "background: '#0A1D3F'"],
    
    // Fix light text on light backgrounds
    [/color:\s*['"]#?fff?f?['"]/gi, "color: '#FFFFFF'"],
    [/color:\s*['"]white['"]/gi, "color: '#FFFFFF'"],
    
    // Fix specific container styles
    [/background:\s*['"]#f8f9fa['"]/gi, "background: 'rgba(255, 255, 255, 0.05)'"],
    [/background:\s*['"]#f5f7fa['"]/gi, "background: 'rgba(255, 255, 255, 0.05)'"],
    [/background:\s*['"]linear-gradient\(135deg,\s*#f5f7fa\s+0%,\s*#c3cfe2\s+100%\)['"]/gi, 
     "background: 'linear-gradient(135deg, rgba(10, 29, 63, 0.9) 0%, rgba(0, 229, 255, 0.1) 100%)'"],
  ];
  
  fixes.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${path.basename(filePath)}`);
};

// Find all JS components
const jsFiles = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.js'))
  .map(file => path.join(componentsDir, file));

console.log(`Found ${jsFiles.length} components to check...`);
jsFiles.forEach(fixComponent);
console.log('Done! Run: npx gatsby clean && npm run develop');