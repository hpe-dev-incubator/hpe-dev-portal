import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, withPrefix } from 'gatsby';
import { Box, Button, Paragraph } from 'grommet';
import { FormDown } from 'grommet-icons';
import {
  BlogCard,
  Layout,
  SEO,
  PageDescription,
  FeaturedBlogCard,
  SectionHeader,
  ResponsiveGrid,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: 'auto',
  medium: ['flex', 'flex'],
  large: ['flex', 'flex', 'flex', 'flex'],
  xlarge: ['flex', 'flex', 'flex', 'flex'],
};

function Blog({ data }) {
  const featuredposts = data.featuredblogs.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  const initialPage = data.paginatedCollectionPage;
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage.nodes);
  const [collectionId, setCollectionId] = useState(initialPage.collection.id);

  useEffect(() => {
    setCollectionId(latestPage.collection.id);
  }, []);

  const loadNextPage = useCallback(async () => {
    if (!latestPage.hasNextPage) return;
    const nextPageId = latestPage.nextPage.id;
    const path = withPrefix(
      `/paginated-data/${collectionId}/${nextPageId}.json`,
    );
    const res = await fetch(path);
    const json = await res.json();

    setBlogPosts((state) => [...state, ...json.nodes]);
    setLatestPage(json);
  }, [latestPage, collectionId]);

  return (
    <Layout title={siteTitle}>
      <SEO title="Blog" />
      <PageDescription image="/img/blogs/blogs.svg" title="Blog">
        <Paragraph>
          Sharing expertise is a great way to move technology forward. Browse
          through our library of tutorials and articles to learn new ways to do
          things. Or write your own!
        </Paragraph>
      </PageDescription>
      {featuredposts && featuredposts.length > 0 && (
        <SectionHeader title="Featured Blogs">
          <FeaturedBlogCard
            key={featuredposts[0].node.id}
            node={featuredposts[0].node}
            margin="medium"
          />
          <ResponsiveGrid rows={{}} columns={columns}>
            {featuredposts.map(
              ({ node }, index) =>
                node.fields.slug !== '/' &&
                index > 0 && <BlogCard key={node.id} node={node} />,
            )}
          </ResponsiveGrid>
        </SectionHeader>
      )}
      <SectionHeader title="All Blogs">
        <ResponsiveGrid rows={{}} columns={columns}>
          {blogPosts.map(
            (blogPost) =>
              blogPost.url !== '/' && (
                <BlogCard key={blogPost.id} node={blogPost} />
              ),
          )}
        </ResponsiveGrid>
      </SectionHeader>
      <Box align="center" pad="medium">
        <Button
          icon={<FormDown />}
          hoverIndicator
          reverse
          onClick={loadNextPage}
          label="Load More"
        />
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
            id: PropTypes.string.isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string,
              description: PropTypes.string,
              authorimage: PropTypes.string,
              thumbnailimage: PropTypes.string,
              category: PropTypes.string,
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
            authorimage: PropTypes.string,
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
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { featuredBlog: { eq: true } }
      }
      sort: { fields: [frontmatter___priority], order: ASC }
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
            tags
            authorimage
            thumbnailimage
            category
          }
        }
      }
    }
  }
`;
