import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';

import { Layout, Link, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Tags({ data }) {
  const { group } = data.allMarkdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Tags" />
      <Box flex={false} direction="row-responsive" wrap gap="large">
        <Box pad={{ top: 'large', horizontal: 'xlarge' }}>
          <Heading margin={{ top: 'none', bottom: 'xsmall' }}>Tags</Heading>
        </Box>
        <Box pad="large">
          <ul>
            {group.map(tag => (
              <li key={tag.fieldValue}>
                <Link to={`/blog/tag/${tag.fieldValue}/`}>
                  <Text size="large">
                    {tag.fieldValue} ({tag.totalCount})
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </Layout>
  );
}

Tags.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
};

export default Tags;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
