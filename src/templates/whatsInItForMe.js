import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Paragraph } from 'grommet';
import { Content, Layout, Markdown, SEO, PageDescription } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

function WhatsInItForMe({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <PageDescription
        image="/img/dev-thumb2.png"
        title={title}
        alt="blog page logo"
      >
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
          scelerisque velit. Phasellus et felis massa. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Nam nulla elit, bibendum non nibh
          quis, posuere accumsan sem. Ut gravida commodo dictum.
        </Paragraph>
      </PageDescription>
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'medium' }} />
          <Content gap="large" margin={{ vertical: 'large' }}>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          </Content>
        </Box>
      </Box>
    </Layout>
  );
}

WhatsInItForMe.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default WhatsInItForMe;

export const pageQuery = graphql`
  query WhatsInItForMeBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
      }
      rawMarkdownBody
    }
  }
`;
