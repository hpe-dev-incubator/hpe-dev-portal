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

function NewsletterTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const dateFormat = Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const { rawMarkdownBody, excerpt } = post;
  const { date, title, tags } = post.frontmatter;
  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box direction="row-responsive" pad="large">
        <Box gap="medium">
          <Heading margin="none">{title}</Heading>
          {dateFormat.format(new Date(date))}
        </Box>
        <Content margin={{ vertical: 'large' }}>
          <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          {tags && (
            <Box direction="row-responsive" align="baseline" gap="small">
              <Heading level={2} margin={{ vertical: 'none' }}>
                Tags:
              </Heading>
              {tags.map((tag) => (
                <Link to={`/blog/tag/${tag}`} key={tag} size="xxlarge">
                  {tag}
                </Link>
              ))}
            </Box>
          )}
        </Content>
      </Box>
    </Layout>
  );
}

NewsletterTemplate.propTypes = {
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
        date: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default NewsletterTemplate;

export const pageQuery = graphql`
  query NewslettersBySlug($slug: String!) {
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
        date
      }
    }
  }
`;
