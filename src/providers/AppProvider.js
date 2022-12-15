import React, { useMemo, useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({
  data: {},
  user: {},
  setUser: () => null,
});

const { GATSBY_COCKPIT_HPE_USER } = process.env;

const AppProvider = ({ children }) => {
  const [userStr, setUser] = useState(null);

  const fetchUserDetail = (userData) => {
    if (!userData) {
      fetch(`${GATSBY_COCKPIT_HPE_USER}`, { credentials: 'include' })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          console.log({ apiData: response });
          if (
            response.status !== 401 &&
            response.code !== 'AuthenticationCredentialsNotFoundException'
          ) {
            const userDetails = {
              id: response.uuid,
              name: response.name,
              email: response.email,
              type: 'HPE',
              roles: [],
              accessToken: '',
            };
            // const userStr = JSON.stringify(userDetails);
            // localStorage.setItem('userInfo', userStr);
            setUser(userDetails);
          }
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
  };

  useEffect(() => {
    fetchUserDetail(userStr);
  }, [userStr]);

  const user = useMemo(() => {
    if (userStr) {
      return userStr;
    }
    return null;
  }, [userStr]);

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

  return (
    <AppContext.Provider value={{ data, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react/prop-types */
export default ({ element }) => <AppProvider>{element}</AppProvider>;
