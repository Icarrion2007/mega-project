#!/bin/bash
echo "=== M.E.G.A. PROJECT DIAGNOSTIC ==="
echo "Timestamp: $(date)"
echo

echo "1. Node.js Environment:"
node --version
npm --version
echo

echo "2. Project Structure:"
ls -la
echo

echo "3. Package Dependencies:"
npm list --depth=0
echo

echo "4. Critical File Checksums:"
md5sum package.json gatsby-config.js 2>/dev/null || echo "md5sum not available"
echo

echo "5. Build Test:"
npm run build 2>&1 | tail -20
echo

echo "6. Data Pipeline Status:"
if [ -f "scripts/fetch-money-trail.js" ]; then
  echo "Fetch script exists"
  node scripts/fetch-money-trail.js 2>&1 | tail -5
else
  echo "No fetch script found"
fi
echo

echo "7. API Key Check:"
if [ -f ".env.development" ]; then
  grep -q "FEC_API_KEY" .env.development && echo "✓ API Key configured" || echo "✗ No API Key"
else
  echo "No .env file found"
fi
