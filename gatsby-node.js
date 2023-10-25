/* eslint-disable max-len */
/* eslint-disable no-console */
// const fs = require('fs');
// const path = require('path');
const axios = require('axios');
require('dotenv').config();

const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = async ({ actions }) => {
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
        path: `/workshops/${id - 1}/special-badge`,
        component: require.resolve(
          './src/pages/workshops/template.js',
        ),
        context: {
          specialBadgeId: id,
          title,
          description,
          badgeImg,
        },
      });
      console.log(
        `Create pages /workshops/${id - 1}/special-badge from ${id}`,
      );
      console.log('------------------------------');
    });
  } catch (error) {
    console.log('error: ', error);
  }

  try {
    // eslint-disable-next-line max-len
    const workshopsApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
    const getWorkshops = await axios({
      method: 'GET',
      url: workshopsApi,
    });

    getWorkshops.data.forEach(({ id, name, description,workshop }) => {
  //     createPage({
  //       path: `/hackshack/replays/${id}`,
  // eslint-disable-next-line max-len
  //       component: require.resolve('./src/pages/hackshack/replays/template.js'),
  //       context: {
  //         workshopId: id,
  //         workshopTitle: title,
  //         workshopDesc: desc,
  //         workshopImg: workshop && workshop.workshopImg,
  //       },
  //     });

  //     console.log(`Create pages /hackshack/replays/${id} from ${id}`);
  //     console.log('------------------------------');

      createPage({
        path: `/workshop/${id}`,
        component: require.resolve('./src/pages/replays/template.js'),
        context: {
          workshopId: id,
          workshopTitle: name,
          workshopDesc: description,
          workshopImg: workshop && workshop.workshopImg,
        },
      });

  //     console.log(`Create pages /hackshack/workshop/${id} from ${id}`);
  //     console.log('------------------------------');

  //     createPage({
  //       path: `/hackshack/workshop/${id}/finisher-badge`,
  // eslint-disable-next-line max-len
  //       component: require.resolve('./src/pages/hackshack/replays/template.js'),
  //       context: {
  //         workshopId: id,
  //         workshopTitle: title,
  //         workshopDesc: desc,
  //         workshopImg: workshop && workshop.badgeImg,
  //       },
  //     });

  //     console.log(
  //       `Create pages /hackshack/workshop/${id}/finisher-badge from ${id}`,
  //     );
  //     console.log('------------------------------');
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage, createPage } = actions;

  console.log(`onCreatePage ${page.componentPath}`);
  console.log(page);
  return new Promise((resolve) => {
    // if the page component is the index page component
    if (page.componentPath.indexOf('/src/pages/index.js') >= 0) {
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

