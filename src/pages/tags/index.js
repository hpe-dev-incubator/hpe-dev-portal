/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';

import { Layout, Link, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const tags = (group) => {
  const counts = {};
  group.map(({ fieldValue, totalCount }) => {
    if (fieldValue) {
      const tag = fieldValue.toLowerCase();
      const entry = counts[tag];
      if (entry) {
        entry.totalCount += totalCount;
      } else {
        counts[tag] = { fieldValue, totalCount, tag, url: `/blog/tag/${tag}` };
      }
    }
    return undefined;
  });

  // convert to array
  return Object.keys(counts)
    .map((key) => counts[key])
    .sort((a, b) => a.tag.localeCompare(b.tag));
};

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
            {tags(group).map(({ fieldValue, totalCount, url }) => (
              <li key={fieldValue}>
                <Link to={url}>
                  <Text size="large">
                    {fieldValue} ({totalCount})
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
    allMarkdownRemark(limit: 2000,filter: {frontmatter: {disable: {ne: true}}}) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
