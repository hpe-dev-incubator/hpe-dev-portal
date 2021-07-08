import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Paragraph, Tab, Tabs } from 'grommet';
import {
  BlogCard,
  Layout,
  SEO,
  PageDescription,
  FeaturedBlogCard,
  SectionHeader,
  ResponsiveGrid,
  OpenSourceTab,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: 'auto',
  medium: ['flex', 'flex'],
  large: ['flex', 'flex', 'flex', 'flex'],
  xlarge: ['flex', 'flex', 'flex', 'flex'],
};

function Blog({ data, location }) {
  console.log('data: ', data);
  const featuredposts = data.featuredblogs.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const [index, setIndex] = React.useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const totalAllBlogsCount = data.allBlogsCount.totalCount;
  const totalOpenSourceBlogsCount = data.openSourceBlogsCount.totalCount;
  // const initialPage = data.allBlogs;
  // const [latestPage, setLatestPage] = useState(initialPage);
  // const [blogPosts, setBlogPosts] = useState(initialPage.nodes);
  // const [collectionId, setCollectionId] = 
  // useState(initialPage.collection.id);

  // useEffect(() => {
  //   setCollectionId(initialPage.collection.id);

  //   const blogLocalStorage = JSON.parse(localStorage.getItem('blogData'));

  //   if (
  //     blogLocalStorage &&
  //     blogLocalStorage.latestPage &&
  //     blogLocalStorage.latestBlogPosts
  //   ) {
  //     setLatestPage(blogLocalStorage.latestPage);
  //     setBlogPosts(blogLocalStorage.latestBlogPosts);
  //   }

  //   if (location.state && location.state.isBlogHeaderClicked) {
  //     navigate('/blog', { replace: true });
  //     setLatestPage(initialPage);
  //     setBlogPosts(initialPage.nodes);
  //     localStorage.removeItem('blogPosition');
  //     localStorage.removeItem('blogData');
  //   }
  // }, [initialPage, location]);

  // useEffect(() => {
  //   const scrollPosition = JSON.parse(localStorage.getItem('blogPosition'));

  //   if (scrollPosition) {
  //     setTimeout(() => {
  //       window.scrollTo
  // ({ top: scrollPosition, left: 0, behavior: 'smooth' });
  //     }, 100);
  //   }
  // }, []);

  // const loadNextPage = useCallback(async (latestPage, collectionId) => {
  //   if (!latestPage.hasNextPage) return;
  //   const nextPageId = latestPage.nextPage.id;
  //   console.log('collectionId: ', collectionId);
  //   console.log('nextPageId: ', nextPageId);
  //   const path = withPrefix(
  //     `/paginated-data/${collectionId}/${nextPageId}.json`,
  //   );
  //   console.log('path: ', path);
  //   const res = await fetch(path);
  //   const json = await res.json();
  //   console.log('res: ', res);
  //   console.log('json: ', json);

  //   setBlogPosts((state) => [...state, ...json.nodes]);
  //   setLatestPage(json);


  // }, [latestPage, collectionId ]);

  return (
    <Layout title={siteTitle}>
      <SEO title="Blog" />
      <PageDescription
        image="/img/blogs/blogs.svg"
        title="Blog"
        alt="blog page logo"
      >
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
              ({ node }, i) =>
                node.fields.slug !== '/' &&
                i > 0 && <BlogCard key={node.id} node={node} />,
            )}
          </ResponsiveGrid>
        </SectionHeader>
      )}
      {/* <SectionHeader title="All Blogs"> */}
      <Tabs
        activeIndex={index}
        onActive={onActive}
        justify="start"
        alignControls="start">
        <Tab title={`All (${totalAllBlogsCount})`}>
          <Box fill pad="large" align="center">
            <OpenSourceTab
              key={index}
              initialPage={data.allBlogs}
              columns={columns}
              location={location}
            />
          </Box>
        </Tab>
        <Tab title="Platforms">
          <Box fill pad="large" align="center">
            Platforms
          </Box>
        </Tab>
        <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
          <Box fill pad="large" align="center">
            <OpenSourceTab
              key={index}
              initialPage={data.openSourceBlogs}
              columns={columns}
              location={location}
            />
          </Box>
        </Tab>
        <Tab title="Others">
          <Box fill pad="large" align="center">
            Open Source
          </Box>
        </Tab>
      </Tabs>
      {/* </SectionHeader> */}
      {/* <Box align="center" pad="medium">
        <Button
          icon={<FormDown />}
          hoverIndicator
          reverse
          onClick={loadNextPage}
          label="Load More"
        />
      </Box> */}
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
    allBlogs: PropTypes.shape({
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
    openSourceBlogs: PropTypes.shape({
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
    allBlogsCount: PropTypes.objectOf(PropTypes.string),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      isBlogHeaderClicked: PropTypes.bool,
    }),
  }),
};

export default Blog;

export const pageQuery = graphql`
  query {
    featuredblogs: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: {
          featuredBlog: { eq: true }
          priority: { lte: 5, gte: 1 }
        }
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
    allBlogsCount: allMarkdownRemark(
      filter: {
        fields: {sourceInstanceName: {eq: "blog"}}, 
        frontmatter: {
          featuredBlog: {ne: true}
        }
      }, 
      sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    }
    openSourceBlogsCount: allMarkdownRemark(
      filter: {
        fields: {sourceInstanceName: {eq: "blog"}}, 
        frontmatter: {
          tags: {eq: "opensource"}
        }
      }, 
      sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    }
    allBlogs: paginatedCollectionPage(
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
    openSourceBlogs: paginatedCollectionPage(
      collection: { name: { eq: "opensource-blog-posts" } }
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
  }
`;
