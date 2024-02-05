import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({
  data: {},
  user: {},
  setUser: () => null,
});


const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetail = () => {
    fetch(`${process.env.GATSBY_COCKPIT_HPE_USER}`, { credentials: 'include' })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
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
          // const user = JSON.stringify(userDetails);
          // localStorage.setItem('userInfo', user);
          setUser(userDetails);
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  useEffect(() => {
    if (!user) {
      fetchUserDetail();
    }
  }, [user]);

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
        sort: {frontmatter: {priority: ASC}}
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
        sort: {frontmatter: {priority: ASC}}
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
        sort: {frontmatter: {priority: ASC}}
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
