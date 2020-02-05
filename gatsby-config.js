module.exports = {
  siteMetadata: {
    title: `Fullstack Developer`,
    description: `Hi, my name is Kevin MARTIN. I'm a fullstack developer, i'm in love with JS. You can clone this project on my github.`,
    author: `@coldfuzion91`,
    lastname: 'MARTIN',
    firstname: 'Kevin',
    job: 'Fullstack Developer',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kevin Martin`,
        short_name: `KevinMartin`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2e6ed0`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    {
      resolve: `gatsby-plugin-sass-resources`,
      options: {
        resources: `${__dirname}/src/styles/all.scss`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prettier`,
            options: {
              usePrettierrc: true,
            },
          },
        ],
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#383c43`,
        theme_color: `#383c43`,
        display: `minimal-ui`,
        icon: `src/images/avatar.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
