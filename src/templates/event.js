import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading } from 'grommet';

import { Content, Layout, Markdown, SEO, Link } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;
function EventTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, tags } = post.frontmatter;
  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box pad="large">
        <Content margin={{ vertical: 'large' }}>
          <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          {tags && (
            <Box align="baseline" gap="small">
              <Heading level={2} margin={{ vertical: 'none' }}>
                Tags
              </Heading>
              <Box
                direction="row-responsive"
                align="baseline"
                style={{ display: 'inline-block' }}
              >
                {tags.map((tag, index) => (
                  <Link
                    to={`/blog/tag/${tag.toLowerCase().trim()}`}
                    key={tag}
                    size="xxlarge"
                  >
                    {tag + (index !== tags.length - 1 ? ',' : '')}
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Content>
      </Box>
    </Layout>
  );
}

EventTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventTemplate;

export const pageQuery = graphql`
  query EventsBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 260)
      rawMarkdownBody
      frontmatter {
        title
        tags
        dateStart
        dateEnd
      }
    }
  }
`;
