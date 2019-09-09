import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Box,
  Heading as GrommetHeading,
  Paragraph,
  Text,
  Markdown,
} from 'grommet';

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

function Blog({ data }) {
  const posts = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const dateFormat = Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Layout title={siteTitle}>
      <SEO title="Blog" />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box pad={{ vertical: 'large', horizontal: 'xlarge' }}>
            <Heading border={{ size: '0px' }}>Blog</Heading>
          </Box>
          <Box>
            {posts.map(
              ({ node }) =>
                node.fields.slug !== '/' && (
                  <Card key={node.id} gap="medium">
                    <Box>
                      <Markdown>
                        {`${dateFormat.format(
                          new Date(node.frontmatter.date),
                        )} by **${node.frontmatter.author}**`}
                      </Markdown>
                      <Heading>{node.frontmatter.title}</Heading>
                    </Box>
                    <Box width="medium">
                      <Paragraph margin="none">{node.excerpt}</Paragraph>
                    </Box>
                    <Link to={`/blog${node.fields.slug}`}>
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

Blog.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Blog;

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
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
            date
            author
          }
        }
      }
    }
  }
`;
