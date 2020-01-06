import React from 'react';
import PropTypes from 'prop-types';

import { Box, Heading } from 'grommet';
import { graphql } from 'gatsby';
import { BlogCard, Layout, Link, SEO } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`;

  return (
    <Layout title={siteTitle}>
      <SEO title="Tags" />
      <Box pad={{ horizontal: 'large' }} gap="medium">
        <Heading margin={{ bottom: 'none' }}>{tagHeader}</Heading>
        <Box>
          {edges.map(({ node }) => {
            const { slug } = node.fields;
            return <BlogCard node={node} key={slug} margin="none" />;
          })}
        </Box>
        <Link to="/tags" label="All tags" />
      </Box>
    </Layout>
  );
};

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
            excerpt: PropTypes.string.isRequired,
          }),
        }).isRequired,
      ),
    }),
  }),
};

export default Tags;

export const pageQuery = graphql`
  query($tagRE: String) {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { regex: $tagRE } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            sourceInstanceName
          }
          frontmatter {
            title
            author
            date
          }
          excerpt
        }
      }
    }
  }
`;
