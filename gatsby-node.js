/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const { createFilePath } = require('gatsby-source-filesystem');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const arrayToRE = (a) =>
  a ? '/^' + a.map((str) => `(${escapeRegExp(str)})`).join('|') + '$/i' : ''; // eslint-disable-line

const setPagination = (queryResult) => {
  const collection = queryResult.data.paginatedCollection;
  const dir = path.join(__dirname, 'public', 'paginated-data', collection.id);
  fs.mkdirSync(dir, { recursive: true });
  collection.pages.forEach((page) =>
    fs.writeFileSync(
      path.resolve(dir, `${page.id}.json`),
      JSON.stringify(page),
    ),
  );
};

const paginatedCollectionQuery = (paginatedName) => {
  return `{
    paginatedCollection(name: { eq: "${paginatedName}" }) {
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
  }`;
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;

  try {
    // eslint-disable-next-line
    const specialBadgesApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/special-badges`;
    const getSpecialBadges = await axios({
      method: 'GET',
      url: specialBadgesApi,
    });

    getSpecialBadges.data.forEach(({ id, title, description, badgeImg }) => {
      createPage({
        path: `/hackshack/workshops/${id - 1}/special-badge`,
        component: require.resolve(
          './src/pages/hackshack/workshops/template.js',
        ),
        context: {
          specialBadgeId: id,
          title,
          description,
          badgeImg,
        },
      });
      console.log(
        `Create pages /hackshack/workshops/${id - 1}/special-badge from ${id}`,
      );
      console.log('------------------------------');
    });
  } catch (error) {
    console.log('error: ', error);
  }

  try {
    // eslint-disable-next-line max-len
    const replaysApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/replays?active=true`;
    const getReplays = await axios({
      method: 'GET',
      url: replaysApi,
    });

    getReplays.data.forEach(({ id, title, desc, workshop }) => {
      createPage({
        path: `/hackshack/replays/${id}`,
        component: require.resolve('./src/pages/hackshack/replays/template.js'),
        context: {
          workshopId: id,
          workshopTitle: title,
          workshopDesc: desc,
          workshopImg: workshop && workshop.workshopImg,
        },
      });

      console.log(`Create pages /hackshack/replays/${id} from ${id}`);
      console.log('------------------------------');

      createPage({
        path: `/hackshack/workshop/${id}`,
        component: require.resolve('./src/pages/hackshack/replays/template.js'),
        context: {
          workshopId: id,
          workshopTitle: title,
          workshopDesc: desc,
          workshopImg: workshop && workshop.workshopImg,
        },
      });

      console.log(`Create pages /hackshack/workshop/${id} from ${id}`);
      console.log('------------------------------');

      createPage({
        path: `/hackshack/workshop/${id}/finisher-badge`,
        component: require.resolve('./src/pages/hackshack/replays/template.js'),
        context: {
          workshopId: id,
          workshopTitle: title,
          workshopDesc: desc,
          workshopImg: workshop && workshop.badgeImg,
        },
      });

      console.log(
        `Create pages /hackshack/workshop/${id}/finisher-badge from ${id}`,
      );
      console.log('------------------------------');
    });
  } catch (error) {
    console.log('error: ', error);
  }

  const blogPost = path.resolve('./src/templates/blog-post.js');
  const platform = path.resolve('./src/templates/platform.js');
  const event = path.resolve('./src/templates/event.js');
  const newsletter = path.resolve('./src/templates/newsletter.js');
  const tagTemplate = path.resolve('./src/templates/tags.js');
  const campaignTemplate = path.resolve('./src/templates/campaign.js');
  const roleTemplate = path.resolve('./src/templates/role.js');
  const useCasesTemplate = path.resolve('./src/templates/use-case.js');

  const allQueryResult = await graphql(paginatedCollectionQuery('blog-posts'));
  const openSourceQueryResult = await graphql(
    paginatedCollectionQuery('opensource-blog-posts'),
  );
  const ezmeralRuntimeQueryResult = await graphql(
    paginatedCollectionQuery('ezmeral-blog-posts'),
  );
  const spiffeQueryResult = await graphql(
    paginatedCollectionQuery('spiffe-blog-posts'),
  );
  const dataFabricQueryResult = await graphql(
    paginatedCollectionQuery('data-fabric-posts'),
  );
  const greenLakeQueryResult = await graphql(
    paginatedCollectionQuery('greenlake-posts'),
  );
  const chapelQueryResult = await graphql(
    paginatedCollectionQuery('chapel-posts'),
  );
  const grommetQueryResult = await graphql(
    paginatedCollectionQuery('grommet-posts'),
  );
  const alletraQueryResult = await graphql(
    paginatedCollectionQuery('alletra-posts'),
  );
  const deepLearningQueryResult = await graphql(
    paginatedCollectionQuery('deep-learning-posts'),
  );
  const threeParQueryResult = await graphql(
    paginatedCollectionQuery('3par-posts'),
  );
  const nimbleQueryResult = await graphql(
    paginatedCollectionQuery('nimble-posts'),
  );
  const oneviewQueryResult = await graphql(
    paginatedCollectionQuery('oneview-posts'),
  );
  const oneviewDashboardQueryResult = await graphql(
    paginatedCollectionQuery('oneview-dashboard-posts'),
  );
  const iloQueryResult = await graphql(paginatedCollectionQuery('ilo-posts'));
  const determinedQueryResult = await graphql(
    paginatedCollectionQuery('determined-ai-posts'),
  );
  const dsccQueryResult = await graphql(paginatedCollectionQuery('dscc-posts'));
  const projectDataMapQueryResult = await graphql(
    paginatedCollectionQuery('project-data-map-posts'),
  );
  // const zertoQueryResult = await graphql(
  //   paginatedCollectionQuery('zerto-posts'),
  // );
  const arubaQueryResult = await graphql(
    paginatedCollectionQuery('aruba-posts'),
  );
  const kubeDirectorQueryResult = await graphql(
    paginatedCollectionQuery('kubedirector-posts'),
  );
  const simplivityQueryResult = await graphql(
    paginatedCollectionQuery('simplivity-posts'),
  );
  const smartsimQueryResult = await graphql(
    paginatedCollectionQuery('smartsim-posts'),
  );

  const crayQueryResult = await graphql(
    paginatedCollectionQuery('cray-posts'),
  );

  const swarmQueryResult = await graphql(
    paginatedCollectionQuery('swarm-posts'),
  );

  const hpeNonStopQueryResult = await graphql(
    paginatedCollectionQuery('hpe-nonstop-posts'),
  );

  const othersQueryResult = await graphql(
    paginatedCollectionQuery('others-posts'),
  );

  setPagination(allQueryResult);
  setPagination(openSourceQueryResult);
  setPagination(ezmeralRuntimeQueryResult);
  setPagination(spiffeQueryResult);
  setPagination(dataFabricQueryResult);
  setPagination(greenLakeQueryResult);
  setPagination(chapelQueryResult);
  setPagination(grommetQueryResult);
  setPagination(alletraQueryResult);
  setPagination(deepLearningQueryResult);
  setPagination(threeParQueryResult);
  setPagination(nimbleQueryResult);
  setPagination(oneviewQueryResult);
  setPagination(oneviewDashboardQueryResult);
  setPagination(iloQueryResult);
  setPagination(determinedQueryResult);
  setPagination(dsccQueryResult);
  setPagination(projectDataMapQueryResult);
  // setPagination(zertoQueryResult);
  setPagination(arubaQueryResult);
  setPagination(kubeDirectorQueryResult);
  setPagination(simplivityQueryResult);
  setPagination(smartsimQueryResult);
  setPagination(crayQueryResult);
  setPagination(swarmQueryResult);
  setPagination(hpeNonStopQueryResult);
  setPagination(othersQueryResult);

  return graphql(
    `
      {
        allMarkdownRemark(
          filter: { frontmatter: { disable: { ne: true } } }
          sort: {frontmatter: {date: DESC}}
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
                disable
                tags
                isAside
              }
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000,
          filter:{frontmatter:{disable:{ne:true}}}) {
          group(field: {frontmatter: {tags: SELECT}}) {
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
              tagRE: arrayToRE(post.node.frontmatter.tags),
              previous,
              next,
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'platform') {
          const { sourceInstanceName, slug } = post.node.fields;
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: platform,
            context: {
              slug: post.node.fields.slug,
              tagRE: arrayToRE(post.node.frontmatter.tags),
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'greenlake') {
          const { sourceInstanceName, slug } = post.node.fields;
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
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
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
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
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: newsletter,
            context: {
              slug: post.node.fields.slug,
              tags: post.node.frontmatter.tags || [],
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'campaign') {
          const { sourceInstanceName, slug } = post.node.fields;
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: campaignTemplate,
            context: {
              slug: post.node.fields.slug,
              tags: post.node.frontmatter.tags || [],
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'role') {
          const { sourceInstanceName, slug } = post.node.fields;
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: roleTemplate,
            context: {
              slug: post.node.fields.slug,
              tagRE: arrayToRE(post.node.frontmatter.tags),
            },
          });
        } else if (post.node.fields.sourceInstanceName === 'use-cases') {
          const { sourceInstanceName, slug } = post.node.fields;
          // console.log(
          //   `Create pages /${sourceInstanceName}${slug} from ${slug}`,
          // );
          // console.log('------------------------------');
          createPage({
            path: `/${sourceInstanceName}${slug}`,
            component: useCasesTemplate,
            context: {
              slug: post.node.fields.slug,
              tagRE: arrayToRE(post.node.frontmatter.tags),
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
    const date = new Date(node.frontmatter.date);
    const year = date.getFullYear();
    createNodeField({ node, name: 'year', value: year });
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
        isUpcoming: {
          type: 'Boolean!',
          resolve: (source) =>
            new Date(source.frontmatter.dateEnd) > new Date() &&
            !(
              new Date() >= new Date(source.frontmatter.dateStart) &&
              new Date() <= new Date(source.frontmatter.dateEnd)
            ),
        },
        isOngoing: {
          type: 'Boolean!',
          resolve: (source) =>
            new Date() >= new Date(source.frontmatter.dateStart) &&
            new Date() <= new Date(source.frontmatter.dateEnd),
        },
        isPast: {
          type: 'Boolean!',
          resolve: (source) =>
            new Date(source.frontmatter.dateEnd) < new Date(),
        },
      },
    }),
  ]);
};
