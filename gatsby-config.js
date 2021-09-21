const remark = require('remark');
const strip = require('strip-markdown');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const lunrHighlightPlugin = () => (builder) => {
  builder.metadataWhitelist.push('position');
};

const stripMarkdown = (markdown) => {
  let text = markdown;
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      text = file.contents;
    });
  return text;
};

const paginatedCollection = (name, tag) => {
  return {
    resolve: 'gatsby-plugin-paginated-collection',
    options: {
      name,
      pageSize: 12,
      query: `
      {
        allMarkdownRemark(filter: {fields: {sourceInstanceName: {eq: "blog"}
      }, frontmatter: {tags: {eq: "${tag}"}}},
        sort: {fields: [frontmatter___date], order: DESC}) {
          nodes {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              date
              description
              author
              tags
              authorimage
            }
            excerpt
          }
        }
      }
      `,
      normalizer: ({ data }) =>
        data.allMarkdownRemark.nodes.map((node) => ({
          id: node.id,
          title: node.frontmatter.title,
          date: node.frontmatter.date,
          description: node.excerpt,
          author: node.frontmatter.author,
          tags: node.frontmatter.tags,
          authorimage: node.frontmatter.authorimage,
          fields: {
            slug: node.fields.slug,
            sourceInstanceName: node.fields.sourceInstanceName,
          },
        })),
    },
  };
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
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
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
        path: `${__dirname}/content/event`,
        name: 'event',
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
        path: `${__dirname}/content/opensource`,
        name: 'opensource',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/newsletter`,
        name: 'newsletter',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/community`,
        name: 'community',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/campaign`,
        name: 'campaign',
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
        path: `${__dirname}/content/skillup`,
        name: 'skillup',
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
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/contribute`,
        name: 'contribute',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/api`,
        name: 'api',
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
        trackingId: 'UA-108944070-6',
        head: true,
      },
    },
    {
      resolve: 'gatsby-plugin-adobe-launch-hpe',
      options: {
        pluginConfig: {
          analyticsScript:
            'https://www.hpe.com/global/metrics/easy/basic_measurement.js',
        },
        events: {
          onRouteUpdate: 'ANALYTICS.PAGEVIEW',
        },
        breadCrumbs: {
          countryCode: 'us',
          languageCode: 'en',
          siteSection: 'non-aem:developer',
          pageLevel: 'main',
        },
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
      resolve: 'gatsby-plugin-paginated-collection',
      options: {
        name: 'blog-posts',
        pageSize: 12,
        query: `
        {
          allMarkdownRemark(filter: {fields: {sourceInstanceName: {eq: "blog"}
        }, frontmatter: {featuredBlog: {ne: true}}},
          sort: {fields: [frontmatter___date], order: DESC}) {
            nodes {
              id
              fields {
                slug
                sourceInstanceName
              }
              frontmatter {
                title
                date
                description
                author
                tags
                authorimage
              }
              excerpt
            }
          }
        }
        `,
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            date: node.frontmatter.date,
            description: node.excerpt,
            author: node.frontmatter.author,
            tags: node.frontmatter.tags,
            authorimage: node.frontmatter.authorimage,
            fields: {
              slug: node.fields.slug,
              sourceInstanceName: node.fields.sourceInstanceName,
            },
          })),
      },
    },
    {
      resolve: 'gatsby-plugin-paginated-collection',
      options: {
        name: 'others-posts',
        pageSize: 12,
        query: `
        {
          allMarkdownRemark(filter: {fields: {sourceInstanceName: {eq: "blog"}
          }, frontmatter: {tags: {nin: [
          "opensource", 
          "hpe-ezmeral-container-platform", 
          "spiffe-and-spire-projects", 
          "hpe-ezmeral-data-fabric", 
          "hpe-greenlake", 
          "chapel", 
          "grommet", 
          "hpe-alletra", 
          "deep-learning-cookbook", 
          "hpe-3par-and-primera", 
          "hpe-nimble-storage", 
          "hpe-oneview", 
          "hpe-oneview-global-dashboard", 
          "ilo", 
          "ilorest",
          "iLOrest",
          "ilo-restful-api",
          "Redfish",
          ]}}}, sort: {fields: [frontmatter___date], order: DESC}) {
            nodes {
              id
              fields {
                slug
                sourceInstanceName
              }
              frontmatter {
                title
                date
                description
                author
                tags
                authorimage
              }
              excerpt
            }
          }
        }
        `,
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            date: node.frontmatter.date,
            description: node.excerpt,
            author: node.frontmatter.author,
            tags: node.frontmatter.tags,
            authorimage: node.frontmatter.authorimage,
            fields: {
              slug: node.fields.slug,
              sourceInstanceName: node.fields.sourceInstanceName,
            },
          })),
      },
    },
    paginatedCollection('opensource-blog-posts', 'opensource'),
    paginatedCollection('ezmeral-blog-posts', 'hpe-ezmeral-container-platform'),
    paginatedCollection('spiffe-blog-posts', 'spiffe-and-spire-projects'),
    paginatedCollection('data-fabric-posts', 'hpe-ezmeral-data-fabric'),
    paginatedCollection('greenlake-posts', 'hpe-greenlake'),
    paginatedCollection('chapel-posts', 'chapel'),
    paginatedCollection('grommet-posts', 'grommet'),
    paginatedCollection('alletra-posts', 'hpe-alletra'),
    paginatedCollection('deep-learning-posts', 'deep-learning-cookbook'),
    paginatedCollection('3par-posts', 'hpe-3par-and-primera'),
    paginatedCollection('nimble-posts', 'hpe-nimble-storage'),
    paginatedCollection('oneview-posts', 'hpe-oneview'),
    paginatedCollection(
      'oneview-dashboard-posts',
      'hpe-oneview-global-dashboard',
    ),
    {
      resolve: 'gatsby-plugin-paginated-collection',
      options: {
        name: 'ilo-posts',
        pageSize: 12,
        query: `
          {
            allMarkdownRemark(filter: {fields: {sourceInstanceName: {eq: "blog"}
            }, frontmatter: {tags: {in: [
              "ilo",
              "Redfish",
              "ilorest",
              "iLOrest",
              "ilo-restful-api" 
              ]}}}, sort: {fields: [frontmatter___date], order: DESC}) {
              nodes {
                id
                fields {
                  slug
                  sourceInstanceName
                }
                frontmatter {
                  title
                  date
                  description
                  author
                  tags
                  authorimage
                }
                excerpt
              }
            }
          }
          `,
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            date: node.frontmatter.date,
            description: node.excerpt,
            author: node.frontmatter.author,
            tags: node.frontmatter.tags,
            authorimage: node.frontmatter.authorimage,
            fields: {
              slug: node.fields.slug,
              sourceInstanceName: node.fields.sourceInstanceName,
            },
          })),
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
        filterNodes: (node) => !!node.frontmatter,
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the
          // fields' values
          MarkdownRemark: {
            title: (node) => node.frontmatter.title,
            tags: (node) =>
              node.frontmatter.tags
                ? node.frontmatter.tags.join(', ')
                : undefined,
            body: (node) => stripMarkdown(node.rawMarkdownBody),
            path: (node) =>
              node.fields.sourceInstanceName === 'homepanels'
                ? '/'
                : `${node.fields.sourceInstanceName}${node.fields.slug.replace(
                    /\/aside[/]?$/,
                    '/home',
                  )}`,
            sourceInstanceName: (node) => node.fields.sourceInstanceName,
          },
        },
      },
    },
  ],
};
