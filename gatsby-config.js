// REPLACE ENTIRE FILE: gatsby-config.js
require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: 'M.E.G.A. - Make Every Government Accountable',
    description: 'Transparency tool for campaign finance and government accountability',
    author: 'M.E.G.A. Project',
    siteUrl: 'https://the-mega-project.org',
  },
  plugins: [
    // React Helmet for SEO
    'gatsby-plugin-react-helmet',
    
    // Styled Components support
    'gatsby-plugin-styled-components',
    
    // Image handling plugins
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    
    // JSON data loading (CRITICAL for moneyTrail.json)
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data/`,
      },
    },
    'gatsby-transformer-json',
    
    // Sitemap generation (optional but recommended)
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/',
        excludes: [],
      },
    },
  ],
  flags: {
    DEV_SSR: true,
    FAST_DEV: true,
  },
};