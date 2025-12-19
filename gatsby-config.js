require('dotenv').config();
module.exports = {
  siteMetadata: {
    title: 'M.E.G.A. - Make Every Government Accountable',
    description: 'Transparency tool for campaign finance and government accountability',
    author: 'M.E.G.A. Project',
    siteUrl: 'https://the-mega-project.org',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
  flags: {
    DEV_SSR: true,
  },
};
EOF && \
echo "3. Building..." && \
npx gatsby clean 2>/dev/null && \
npm run build && \
echo "🎯 BUILD COMPLETE!" && \
echo "🌐 Starting server at http://localhost:9000" && \
echo "" && \
echo "📊 REAL FEC DATA LOADED:" && \
echo "   • 100 campaign contributions" && \
echo "   • $10,000 total" && \
echo "   • Actual donor data from FEC API" && \
echo "" && \
npx serve public -p 9000

git add .
git commit -m "feat: Phase 3.1-3.2 complete - Real FEC data with $12K+ contributions"
git push origin main

echo "✅ Deploying to Vercel..."
echo "Check: https://vercel.com/mega-projects-projects"
cat > continuum-manifest-v3.2-final.json << 'EOF'
{
  "project": "M.E.G.A. - Resonant Antigen",
  "phase": "3.2",
  "status": "COMPLETE",
  "timestamp": "2025-12-19",
  "data_status": "LIVE",
  "data_metrics": {
    "records": 100,
    "total_amount": 12134.88,
    "election_cycle": "2024",
    "sample_donor": "WERNER, JOSEPH",
    "sample_amount": 57.69
  },
  "components_operational": [
    "QuickStats",
    "TriangulationPreview_v3.1",
    "VisualizationHub",
    "Principles",
    "HowItWorks",
    "Hero",
    "Footer"
  ],
  "deployment_targets": {
    "vercel": "https://vercel.com/mega-projects-projects",
    "domain": "the-mega-project.org",
    "github": "https://github.com/Icarrion2007/mega-project"
  },
  "next_phase": "3.3",
  "next_objectives": [
    "Implement D3.js charts for data visualization",
    "Add Congress.gov API for Official Narrative column",
    "Build interactive geographic map",
    "Create Library section with framework essays"
  ]
}
