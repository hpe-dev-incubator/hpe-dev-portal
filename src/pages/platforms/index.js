import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image } from 'grommet';

import { PlatformCard, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

function Platforms({ data }) {
  const platforms = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Platforms" />
      <Box
        flex
        overflow="auto"
        gap="medium"
        pad="small"
        direction="column"
        wrap
      >
        <Box direction="row-responsive" align="left" gap="medium" pad="large">
          <Box>
            <Image fit="contain" src="/img/platforms/platform.svg" />
          </Box>
          <Box
            align="left"
            direction="column"
            pad={{ vertical: 'large', horizontal: 'large' }}
          >
            <Heading margin="none">Platforms</Heading>
            <Text>
              Get a peek at some of the new technologies we're excited about and
              think you will be too!
            </Text>
          </Box>
        </Box>
        <Box
          flex={false}
          direction="row"
          wrap
          pad={{ top: 'medium' }}
          border={{
            side: 'top',
            color: 'orange',
            size: 'small',
          }}
        >
          {platforms.map(({ node }) => (
            <PlatformCard
              key={node.id}
              width="large"
              align={node.frontmatter.align}
              content={node.frontmatter.description}
              link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
              image={node.frontmatter.image}
              title={node.frontmatter.title}
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
}

Platforms.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              version: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              frontpage: PropTypes.bool,
              priority: PropTypes.number,
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

export default Platforms;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: {
          sourceInstanceName: { eq: "platform" }
          slug: { regex: "//home/$/" }
        }
        frontmatter: { isAside: { ne: true } }
      }
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
            version
            description
            image
            frontpage
            priority
          }
        }
      }
    }
  }
`;
