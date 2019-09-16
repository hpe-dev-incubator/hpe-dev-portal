import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading as GrommetHeading, Paragraph, Text } from 'grommet';

import { Layout, Link, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const Card = ({ children, ...rest }) => (
  <Box
    margin={{
      left: 'large',
      right: 'large',
    }}
    pad={{
      bottom: 'large',
      top: 'large',
    }}
    gap="medium"
    border={{
      side: 'bottom',
      color: 'light-2',
      size: 'medium',
    }}
    justify="center"
    {...rest}
  >
    {children}
  </Box>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

const Heading = ({ children, ...rest }) => (
  <GrommetHeading
    level={2}
    size="large"
    margin={{ top: 'none', bottom: 'xsmall' }}
    {...rest}
  >
    {children}
  </GrommetHeading>
);

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

function Platforms({ data }) {
  const posts = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Platforms" />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box pad={{ vertical: 'large', horizontal: 'xlarge' }}>
            <Heading border={{ size: '0px' }}>Platforms</Heading>
          </Box>
          <Box>
            {posts.map(
              ({ node }) =>
                node.fields.slug !== '/' && (
                  <Card key={node.id} gap="medium">
                    <Box>
                      <Heading>{node.frontmatter.title}</Heading>
                      <Text size="small" color="neutral-4">
                        {node.frontmatter.version}
                      </Text>
                    </Box>
                    <Box width="medium">
                      <Paragraph margin="none">
                        {node.frontmatter.description}
                      </Paragraph>
                    </Box>
                    <Link to={`/platform${node.fields.slug}`}>
                      <Text color="brand">Read more ></Text>
                    </Link>
                  </Card>
                ),
            )}
          </Box>
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
      filter: { fields: { sourceInstanceName: { eq: "platform" } } }
      sort: { fields: [frontmatter___title] }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
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
