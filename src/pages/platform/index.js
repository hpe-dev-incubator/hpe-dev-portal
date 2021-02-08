import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';

import {
  PlatformCard,
  Layout,
  SEO,
  PageDescription,
  ResponsiveGrid,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Platform({ data }) {
  const platforms = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Platforms" />
      <Box flex overflow="auto" gap="large" pad="xlarge" wrap>
        <PageDescription
          image="/img/platforms/PlatformsPage.svg"
          title="Platforms"
        >
          <Text>
            Get a peek at some of the new technologies we're excited about and
            think you will be too!
          </Text>
        </PageDescription>
        <Box
          direction="row"
          wrap
          border={{
            side: 'top',
            color: 'orange',
            size: 'small',
          }}
          gap="large"
          pad={{ top: 'small' }}
        >
          <ResponsiveGrid gap="large" rows={rows} columns={columns}>
            {platforms.map(({ node }) => (
              <PlatformCard
                key={node.id}
                title={node.frontmatter.title}
                description={node.frontmatter.description}
                link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
                image={node.frontmatter.image}
                category={node.frontmatter.category}
              />
            ))}
          </ResponsiveGrid>
        </Box>
      </Box>
    </Layout>
  );
}

Platform.propTypes = {
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

export default Platform;

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
