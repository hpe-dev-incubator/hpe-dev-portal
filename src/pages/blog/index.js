import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Image, Text } from 'grommet';

import { BlogCard, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Blog({ data }) {
  const posts = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Blog" />
      <Box flex overflow="auto" gap="medium" pad="large">
        <Box flex={false} direction="row" pad="large" wrap>
          <Box height="small" width="small">
            <Image fit="contain" src="/img/blogs/blogs.svg" />
          </Box>
          <Box align="start" pad="large">
            <Heading level="4" margin="none">
              Blog
            </Heading>
            <Text>
              Read our blogs on vast range of topics by our community members!
            </Text>
          </Box>
        </Box>
        <Box>
          <Heading margin="none" level="4">
            Featured Blogs
          </Heading>
        </Box>
        <Box
          flex={false}
          direction="row"
          gap="medium"
          wrap
          border={{
            side: 'top',
            color: 'yellow',
            size: 'small',
          }}
        >
          {posts.map(
            ({ node }) =>
              node.fields.slug !== '/' && (
                <BlogCard key={node.id} node={node} />
              ),
          )}
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
              description: PropTypes.string,
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

export default Blog;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "blog" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt(format: MARKDOWN)
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
