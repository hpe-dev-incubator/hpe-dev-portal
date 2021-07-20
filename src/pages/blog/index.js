import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Paragraph, Tab, Tabs, Menu } from 'grommet';
import {
  BlogCard,
  Layout,
  SEO,
  PageDescription,
  FeaturedBlogCard,
  SectionHeader,
  ResponsiveGrid,
  BlogTabContent,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { useLocalStorage } from '../../hooks/use-local-storage';

const columns = {
  small: 'auto',
  medium: ['flex', 'flex'],
  large: ['flex', 'flex', 'flex', 'flex'],
  xlarge: ['flex', 'flex', 'flex', 'flex'],
};

function Blog({ data, location }) {
  const featuredposts = data.featuredblogs.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const totalAllBlogsCount = data.allBlogsCount.totalCount;
  const totalOpenSourceBlogsCount = data.openSourceBlogsCount.totalCount;
  const [platformContent, setPlatformContent] = 
    useState({ key: 0, data: data.allBlogs });
  /* eslint-disable-next-line no-unused-vars */
  const [blogPosition, setBlogPosition] = useLocalStorage('blogPosition');
  const [activeBlogTab, setActiveBlogTab] = useLocalStorage('activeBlogTab');
  const [dropDownData, setDropDownData] = useLocalStorage('dropDownData');

  const platforms = {
    ezmeralBlogs: {
      label: 'HPE Ezmeral Container Platform',
      count: data.ezmeralBlogsCount.totalCount,
    },
    spiffeBlogs: {
      label: 'Spiffee and Spire Projects',
      count: data.spiffeBlogsCount.totalCount,
    },
  };

  const platformsData = Object.entries(data)
    .filter(item => Object.prototype.hasOwnProperty.call(platforms, (item[0])))
    .map((item, i) => {
      return {
        label: `${platforms[item[0]].label} (${platforms[item[0]].count})`,
        onClick: () => {
          setActiveBlogTab(index);
          setDropDownData(item[1]);
          setPlatformContent({ key: i, data: item[1] });
        },
      };
    });

  useEffect(() => {
    if (dropDownData && dropDownData.nodes) {
      setPlatformContent({ data: dropDownData });
    }

    if (activeBlogTab) {
      setIndex(activeBlogTab);
    }

    if (location.state && location.state.isBlogHeaderClicked) {
      navigate('/blog', { replace: true });
      setIndex(0);
      localStorage.removeItem('blogPosition');
      localStorage.removeItem('blogData');
      localStorage.removeItem('activeBlogTab');

    }
  }, [dropDownData, activeBlogTab, location]);

  useEffect(() => {
    const scrollPosition = blogPosition;

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          left: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [blogPosition]);

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
      <Tabs
        activeIndex={index}
        onActive={onActive}
        justify="start"
        alignControls="start"
        pad="20px"
      >
        <Tab title={`All (${totalAllBlogsCount})`}>
          <BlogTabContent
            key={index}
            initialPage={data.allBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
        <Tab
          plain="false"
          title={
            <Menu
              label="Platforms"
              dropProps={{
                align: { top: 'bottom', left: 'left' },
              }}
              items={platformsData}
            />
          }
        >
          <BlogTabContent
            key={platformContent.key}
            initialPage={platformContent.data}
            columns={columns}
            activeTab={index}
            platform
          />
        </Tab>
        <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
          <BlogTabContent
            key={index}
            initialPage={data.openSourceBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
        <Tab title="Others" key={index}>Others</Tab>
      </Tabs>
    </Layout>
  );
}

const blogsPropType = PropTypes.shape({
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
}).isRequired;

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
    allBlogs: blogsPropType,
    openSourceBlogs: blogsPropType,
    ezmeralBlogs: blogsPropType,
    spiffeBlogs: blogsPropType,
    allBlogsCount: PropTypes.objectOf(PropTypes.number),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.number),
    ezmeralBlogsCount: PropTypes.objectOf(PropTypes.number),
    spiffeBlogsCount: PropTypes.objectOf(PropTypes.number),
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
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { featuredBlog: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
    spiffeBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "spiffe-and-spire-projects" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    spiffeBlogs: paginatedCollectionPage(
      collection: { name: { eq: "spiffe-blog-posts" } }
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
    ezmeralBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-ezmeral-container-platform" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    ezmeralBlogs: paginatedCollectionPage(
      collection: { name: { eq: "ezmeral-blog-posts" } }
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
    openSourceBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "opensource" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
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
