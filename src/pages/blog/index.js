import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { graphql, withPrefix } from 'gatsby';
import { Box, Button, Heading, Image, Text } from 'grommet';
import { FormDown } from 'grommet-icons';
import { BlogCard, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Blog({ data }) {
  // const posts = data.blogs.edges;
  const featuredposts = data.featuredblogs.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  const initialPage = data.paginatedCollectionPage;
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage.nodes);

  const loadNextPage = useCallback(async () => {
    if (!latestPage.hasNextPage) return;

    const collectionId = latestPage.collection.id;
    const nextPageId = latestPage.nextPage.id;
    const path = withPrefix(
      `/paginated-data/${collectionId}/${nextPageId}.json`,
    );

    const res = await fetch(path);
    const json = await res.json();

    setBlogPosts((state) => [...state, ...json.nodes]);
    setLatestPage(json);
  }, [latestPage]);

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
          {featuredposts.map(
            ({ node }) =>
              node.fields.slug !== '/' && (
                <BlogCard key={node.id} node={node} />
              ),
          )}
        </Box>
        <Box>
          <Heading margin="none" level="4">
            All Blogs
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
          {blogPosts.map(
            (blogPost) =>
              blogPost.url !== '/' && (
                <BlogCard key={blogPost.id} node={blogPost} />
              ),
          )}
        </Box>
        <Box align="center" pad="medium">
          <Button
            icon={<FormDown />}
            hoverIndicator
            reverse
            onClick={loadNextPage}
            label="Load More"
          />
        </Box>
      </Box>
    </Layout>
  );
}

Blog.propTypes = {
  data: PropTypes.shape({
    featuredblogs: PropTypes.shape({
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
    paginatedCollectionPage: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            title: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            date: PropTypes.string,
            description: PropTypes.string,
          }),
        }).isRequired,
      ).isRequired,
      hasNextPage: PropTypes.bool.isRequired,
      nextPage: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
      collection: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
};

export default Blog;

export const pageQuery = graphql`
  query {
    paginatedCollectionPage(
      collection: { name: { eq: "blog-posts" } }
      index: { eq: 0 }
    ) {
      nodes
      hasNextPage
      nextPage {
        id
      }
      collection {
        id
      }
    }
    featuredblogs: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "featuredblogs" } } }
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
            path
            tags
          }
        }
      }
    }
  }
`;
