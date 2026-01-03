module.exports = {
  siteMetadata: {
    title: "M.E.G.A. Project",
    siteUrl: "https://the-mega-project.org",
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
  ],
};
