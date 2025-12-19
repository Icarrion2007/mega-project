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
