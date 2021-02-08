import React from 'react';
import { Location } from '@reach/router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';

import { Content, Layout, Markdown, SEO, Share } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

function CampaignTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, author } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box
        flex={false}
        direction="row-responsive"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        wrap
      >
        <Content gap="large" margin={{ vertical: 'large' }}>
          <Box gap="small">
            <Text size="xlarge" weight={500}>
              {author}
            </Text>
            <Heading margin="none">{title}</Heading>
            <Location>
              {({ location }) => {
                return <Share url={location.href} text={title} />;
              }}
            </Location>
          </Box>
          <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
        </Content>
      </Box>
    </Layout>
  );
}

CampaignTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        author: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CampaignTemplate;

export const pageQuery = graphql`
  query CampaignBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      rawMarkdownBody
      frontmatter {
        title
        author
      }
    }
  }
`;
