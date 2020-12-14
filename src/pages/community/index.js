import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image } from 'grommet';

import { CommunityCard, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

function Community({ data }) {
  const communities = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Community" />
      <Box
        flex
        overflow="auto"
        gap="medium"
        pad="large"
        direction="column"
        wrap
      >
        <Box
          direction="row-responsive"
          align="start"
          gap="medium"
        >
          <Box height="small" width="small">
            <Image fit="contain" src="/img/community/community.svg" />
          </Box>
          <Box
            align="start"
            direction="column"
            pad={{ vertical: 'large', horizontal: 'small' }}
          >
            <Heading  margin="none">Community</Heading>
            <Text>
              Build with us, Contribute to the HPE Developer Community
            </Text>
          </Box>
        </Box>
        <Box
          flex={false}
          direction="row"
          wrap
          border={{
            side: 'top',
            color: 'orange',
            size: 'small',
          }}
          gap="medium"
        >
          {communities.map(({ node }) => (
            <CommunityCard
              key={node.frontmatter.title}
              title={node.frontmatter.title}
              link={node.frontmatter.link}
              linkname={node.frontmatter.linkname}
              image={node.frontmatter.image}
              description={node.frontmatter.description}
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
}

Community.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              link: PropTypes.string,
              linkname: PropTypes.string,
              priority: PropTypes.number,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Community;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "community" } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            link
            description
            image
            linkname
            priority
          }
        }
      }
    }
  }
`;
