module.exports = {
  assetPrefix: "",
  pathPrefix: "",

  siteMetadata: {
    title: `M.E.G.A. Project`,
    description: `Make Every Government Accountable. Make Earth Great Again.`,
    author: `@MEGAproject`,
  },

  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
  
  flags: {
    DEV_SSR: true,
  },
}
