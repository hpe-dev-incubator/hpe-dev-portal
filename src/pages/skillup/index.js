import React from 'react';
import { Location } from '@reach/router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Image } from 'grommet';

import { Content, Layout, Markdown, SEO, Share } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

function Skillup({ data }) {
  const post = data.allMarkdownRemark.edges[0].node;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box
            pad={{ vertical: 'large', horizontal: 'medium' }}
            direction="column"
          >
            <Image src="/img/blogs/HPE-Dev-Staff.svg" />
          </Box>
          <Content gap="large" margin={{ vertical: 'large' }}>
            <Box gap="small">
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
      </Box>
    </Layout>
  );
}

Skillup.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Skillup;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "skillup" } } }
      sort: { fields: [frontmatter___title] }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
