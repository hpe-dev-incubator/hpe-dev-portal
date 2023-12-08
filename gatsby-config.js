const remark = import('remark');
const strip = import('strip-markdown');
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
      }, frontmatter: {disable:{ne: true},tags: {eq: "${tag}"}}},
        sort: {frontmatter: {date: DESC}}) {
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
              externalLink
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
          externalLink: node.frontmatter.externalLink,
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
    siteUrl: 'https://developer.hpe.com/',
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
        path: `${__dirname}/content/greenlake`,
        name: 'greenlake',
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
        path: `${__dirname}/content/role`,
        name: 'role',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/use-cases`,
        name: 'use-cases',
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
        path: `${__dirname}/content/osscontribute`,
        name: 'osscontribute',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/evangelist`,
        name: 'evangelist',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/hackshackhome`,
        name: 'hackshackhome',
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
          'gatsby-plugin-catch-links',
          'gatsby-remark-copy-linked-files',
       
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
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [
        'G-45LYYFDK5J', // Google Analytics / GA
        ],
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
        },
      },
    },
    // {
    //   resolve: 'gatsby-plugin-adobe-launch-hpe',
    //   options: {
    //     pluginConfig: {
    //       analyticsScript:
    //         'https://www.hpe.com/global/metrics/easy/basic_measurement.js',
    //     },
    //     events: {
    //       onRouteUpdate: 'ANALYTICS.PAGEVIEW',
    //     },
    //     breadCrumbs: {
    //       countryCode: 'us',
    //       languageCode: 'en',
    //       siteSection: 'non-aem:developer',
    //       pageLevel: 'main',
    //     },
    //   },
    // },
    {
      resolve: 'gatsby-plugin-feed',
      options:{
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: {frontmatter: {date: DESC}}
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Your Site's RSS Feed",
          },
        ],
      }
    },
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
        }, frontmatter: {disable:{ne: true},featuredBlog: {ne: true}}},
          sort: {frontmatter: {date: DESC}}) {
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
                externalLink
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
            externalLink: node.frontmatter.externalLink,
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
          }, frontmatter: {disable:{ne: true},tags: {nin: [
          "opensource", 
          "hpe-ezmeral-container-platform", 
          "spiffe-and-spire-projects", 
          "hpe-ezmeral-data-fabric", 
          "hpe-greenlake", 
          "chapel", 
          "grommet", 
          "hpe-alletra",
          "kubedirector" 
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
          "hpe-ezmeral",
          "data-services-cloud-console",
          "determined-ai",
          "cray",
          "swarm-learning",
          "hpe-nonstop"
          ]}}}, sort: {frontmatter: {date: DESC}}) {
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
                externalLink
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
            externalLink: node.frontmatter.externalLink,
            fields: {
              slug: node.fields.slug,
              sourceInstanceName: node.fields.sourceInstanceName,
            },
          })),
      },
    },
    paginatedCollection('opensource-blog-posts', 'opensource'),
    paginatedCollection('ezmeral-blog-posts', 'hpe-ezmeral'),
    paginatedCollection('spiffe-blog-posts', 'spiffe-and-spire-projects'),
    paginatedCollection('data-fabric-posts', 'hpe-ezmeral-data-fabric'),
    paginatedCollection('greenlake-posts', 'hpe-greenlake'),
    paginatedCollection('chapel-posts', 'chapel'),
    paginatedCollection('grommet-posts', 'grommet'),
    paginatedCollection('alletra-posts', 'hpe-alletra'),
    paginatedCollection('deep-learning-posts', 'deep-learning-cookbook'),
    paginatedCollection('3par-posts', 'hpe-3par-and-primera'),
    paginatedCollection('nimble-posts', 'hpe-nimble-storage'),
    paginatedCollection('kubedirector-posts', 'kubedirector'),
    paginatedCollection('project-data-map-posts', 'project-data-map'),
    // paginatedCollection('zerto-posts', 'zerto'),
    paginatedCollection('aruba-posts', 'aruba'),
    paginatedCollection('simplivity-posts', 'hpe-simplivity'),
    paginatedCollection('smartsim-posts', 'SmartSim'),
    paginatedCollection('oneview-posts', 'hpe-oneview'),
    paginatedCollection(
      'oneview-dashboard-posts',
      'hpe-oneview-global-dashboard',
    ),
    paginatedCollection('determined-ai-posts', 'determined-ai'),
    paginatedCollection('cray-posts', 'cray'),
    paginatedCollection('swarm-posts', 'swarm-learning'),
    paginatedCollection('hpe-nonstop-posts', 'hpe-nonstop'),
    paginatedCollection('dscc-posts', 'data-services-cloud-console'),
    {
      resolve: 'gatsby-plugin-paginated-collection',
      options: {
        name: 'ilo-posts',
        pageSize: 12,
        query: `
          {
            allMarkdownRemark(filter: {fields: {sourceInstanceName: {eq: "blog"}
            }, frontmatter: {disable:{ne: true},tags: {in: [
              "ilo",
              "Redfish",
              "ilorest",
              "iLOrest",
              "ilo-restful-api" 
              ]}}}, sort: {frontmatter: {date: DESC}}) {
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
                  externalLink
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
            externalLink: node.frontmatter.externalLink,
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
          { name: 'author', store: true },
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
            author: (node) => node.frontmatter.author,
          },
        },
      },
    },
  ],
};
