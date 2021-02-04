/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const arrayToRE = (a) =>
  a ? '/^' + a.map((str) => `(${escapeRegExp(str)})`).join('|') + '$/i' : ''; // eslint-disable-line

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve('./src/templates/blog-post.js');
  const platform = path.resolve('./src/templates/platform.js');
  const event = path.resolve('./src/templates/event.js');
  const newsletter = path.resolve('./src/templates/newsletter.js');
  const tagTemplate = path.resolve('./src/templates/tags.js');

  const queryResult = await graphql(`
    {
      paginatedCollection(name: { eq: "blog-posts" }) {
        id
        pages {
          id
          nodes
          hasNextPage
          nextPage {
            id
          }
        }
      }
    }
  `);

  const collection = queryResult.data.paginatedCollection;
  const dir = path.join(__dirname, 'public', 'paginated-data', collection.id);
  fs.mkdirSync(dir, { recursive: true });
  collection.pages.forEach((page) =>
    fs.writeFileSync(
      path.resolve(dir, `${page.id}.json`),
      JSON.stringify(page),
    ),
  );

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                sourceInstanceName
              }
              frontmatter {
                title
                tags
                isAside
              }
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `,
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach((post, index) => {
      // Don't create a page for any markdown file which are asides.
      if (!post.node.frontmatter.isAside) {
        if (post.node.fields.sourceInstanceName === 'blog') {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;
          const { sourceInstanceName, slug } = post.node.fields;
          console.log(
            `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          );
          console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              tags: post.node.frontmatter.tags,
              previous,
              next,
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'platform') {
          const { sourceInstanceName, slug } = post.node.fields;
          console.log(
            `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          );
          console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: platform,
            context: {
              slug: post.node.fields.slug,
              tagRE: arrayToRE(post.node.frontmatter.tags),
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'event') {
          const { sourceInstanceName, slug } = post.node.fields;
          console.log(
            `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          );
          console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: event,
            context: {
              slug: post.node.fields.slug,
              tags: post.node.frontmatter.tags || [],
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'newsletter') {
          const { sourceInstanceName, slug } = post.node.fields;
          console.log(
            `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          );
          console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: newsletter,
            context: {
              slug: post.node.fields.slug,
              tags: post.node.frontmatter.tags || [],
            },
          });
        }
      }
    });
    const tags = result.data.tagsGroup.group;
    tags.forEach((tag) => {
      console.log(`Create pages /blog/tag/${tag.fieldValue.toLowerCase()}/`);
      console.log('------------------------------');
      createPage({
        path: `/blog/tag/${tag.fieldValue.toLowerCase()}/`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
          tagRE: `/^${escapeRegExp(tag.fieldValue)}$/i`,
        },
      });
    });
    return null;
  });
};

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage, createPage } = actions;

  console.log(`onCreatePage ${page.componentPath}`);
  return new Promise((resolve) => {
    // if the page component is the index page component
    if (page.componentPath.indexOf('/src/pages/Home/index.js') >= 0) {
      deletePage(page);
      // create a new page but with '/' as path
      createPage({
        ...page,
        path: '/',
      });
    }

    resolve();
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const { sourceInstanceName, absolutePath } = getNode(node.parent);
    console.log(`==== onCreateNode ${sourceInstanceName} ---- ${absolutePath}`);
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
    createNodeField({
      name: 'sourceInstanceName',
      node,
      value: sourceInstanceName,
    });
  }
};

// Filter the events based on the end date
exports.createSchemaCustomization = ({ actions, schema }) => {
  actions.createTypes([
    schema.buildObjectType({
      name: 'MarkdownRemark',
      interfaces: ['Node'],
      fields: {
        isFuture: {
          type: 'Boolean!',
          resolve: (source) =>
            new Date(source.frontmatter.dateEnd) > new Date(),
        },
      },
    }),
  ]);
};
