/* eslint-disable no-console */
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve('./src/templates/blog-post.js');
  const platform = path.resolve('./src/templates/platform.js');
  const tagTemplate = path.resolve('./src/templates/tags.js');

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
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach((post, index) => {
      // Don't create a page for any markdown file with a title of Aside.
      // MD files with Aside in the title are used exclusively for creating links.
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
              tags: post.node.frontmatter.tags || [],
            },
          });
        }
      }
    });

    const tags = result.data.tagsGroup.group;
    tags.forEach(tag => {
      createPage({
        path: `/blog/tag/${tag.fieldValue}/`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      });
    });

    return null;
  });
};

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage, createPage } = actions;

  console.log(`onCreatePage ${page.componentPath}`);
  return new Promise(resolve => {
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
    // Don't create a node for any markdown file with a title of Aside.
    // MD files with Aside in the title are used exclusively for creating links.
    if (!node.frontmatter.isAside) {
      const { sourceInstanceName, absolutePath } = getNode(node.parent);
      console.log(
        `==== onCreateNode ${sourceInstanceName} ---- ${absolutePath}`,
      );
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
  }
};
