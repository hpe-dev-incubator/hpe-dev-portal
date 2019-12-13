const remark = require('remark');
const strip = require('strip-markdown');

const lunrHighlightPlugin = () => builder => {
  builder.metadataWhitelist.push('position');
};

const stripMarkdown = markdown => {
  let text = markdown;
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      text = file.contents;
    });
  return text;
};

module.exports = {
  siteMetadata: {
    title: 'HPE Developer Portal',
    author: 'Hewlett Packard Enterprise',
    description: 'The HPE Developer portal',
    siteUrl: 'https://hpe-dev-portal.netlify.com/',
    social: {
      twitter: 'hpe',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-styled-components',
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/platform`,
        name: 'platform',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/home`,
        name: 'homepanels',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/home.md`,
        name: 'home',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/assets`,
        name: 'assets',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-plugin-catch-links',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        // trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'HPE Developer Portal',
        short_name: 'HPE Developer',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'content/assets/favicon.png',
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#00c781',
        showSpinner: false,
      },
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [{ name: 'en', plugins: [lunrHighlightPlugin] }],
        // Fields to index
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'tags', store: true },
          { name: 'body', store: true },
          { name: 'path', store: true },
          { name: 'sourceInstanceName', store: true },
        ],
        filterNodes: node => !!node.frontmatter,
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the
          // fields' values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            tags: node =>
              node.frontmatter.tags
                ? node.frontmatter.tags.join(', ')
                : undefined,
            body: node => stripMarkdown(node.rawMarkdownBody),
            path: node =>
              node.fields.sourceInstanceName === 'homepanels'
                ? '/'
                : `${node.fields.sourceInstanceName}${node.fields.slug.replace(
                    /\/aside[/]?$/,
                    '/home',
                  )}`,
            sourceInstanceName: node => node.fields.sourceInstanceName,
          },
        },
      },
    },
  ],
};
