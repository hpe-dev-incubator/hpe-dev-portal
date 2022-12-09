import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({ data: {} });

const AppProvider = ({ children }) => {
  const data = useStaticQuery(graphql`
    query ContextNonPageQuery {
      greenlake: allMarkdownRemark(
        filter: {
          fields: {
            sourceInstanceName: { eq: "greenlake" }
            slug: { regex: "//home/$/" }
          }
          frontmatter: { active: { eq: true } }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              active
            }
          }
        }
      }
      platform: allMarkdownRemark(
        filter: {
          fields: {
            sourceInstanceName: { eq: "platform" }
            slug: { regex: "//home/$/" }
          }
          frontmatter: { active: { eq: true } }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              active
            }
          }
        }
      }
      opensource: allMarkdownRemark(
        filter: {
          fields: { sourceInstanceName: { eq: "opensource" } }
          frontmatter: { active: { eq: true } }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
              active
            }
          }
        }
      }
    }
  `);
  return <AppContext.Provider value={{ data }}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react/prop-types */
export default ({ element }) => <AppProvider>{element}</AppProvider>;
