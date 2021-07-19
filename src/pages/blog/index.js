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
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const [openDropButton, setOpenDropButton] = useState(false);
  const totalAllBlogsCount = data.allBlogsCount.totalCount;
  const totalEzmeralBlogsCount = data.ezmeralBlogsCount.totalCount;
  const totalOpenSourceBlogsCount = data.openSourceBlogsCount.totalCount;
  const [content, setContent] = useState({ key: 0, data: data.allBlogs });

  console.log('content: ', content);

  useEffect(() => {
    const dropDownData = JSON.parse(localStorage.getItem('dropDownData'));
    console.log('dropDownData: ', dropDownData);
    if (dropDownData && dropDownData.nodes) {
      setContent({ data: dropDownData });
    }
    const blogTab = JSON.parse(localStorage.getItem('blogTab'));
    const openDropButtonLocalStorage = JSON.parse(
      localStorage.getItem('openDropButton'),
    );
    setIndex(blogTab);
    setOpenDropButton(openDropButtonLocalStorage);

    if (location.state && location.state.isBlogHeaderClicked) {
      navigate('/blog', { replace: true });
      localStorage.removeItem('blogPosition');
      localStorage.removeItem('blogData');
    }
  }, [location]);

  useEffect(() => {
    const scrollPosition = JSON.parse(localStorage.getItem('blogPosition'));

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          left: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, []);

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
        pad='20px'
      >
        <Tab title={`All (${totalAllBlogsCount})`}>
          <OpenSourceTab
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
              open={openDropButton}
              onOpen={() => setOpenDropButton(true)}
              onClose={() => setOpenDropButton(false)}
              dropProps={{
                align: { top: 'bottom', left: 'left' },
              }}
              items={[
                { 
                  label: `HPE Ezmeral Container Platform 
                    (${totalEzmeralBlogsCount})`,
                  onClick: () => {
                    localStorage.setItem('dropDownData', 
                    JSON.stringify(data.ezmeralBlogs));
                    setContent({ key: 1, data: data.ezmeralBlogs });
                  },
                },
                {
                  label: 'Spiffee and Spire Projects',
                  onClick: () => {
                    localStorage.setItem('dropDownData', 
                    JSON.stringify(data.spiffeBlogs));
                    setContent({ key: 2, data: data.spiffeBlogs });
                  },
                },
              ]}
            />
          }
        >
          <OpenSourceTab
            key={content.key}
            initialPage={content.data}
            columns={columns}
            activeTab={index}
            platform="true"
          />
        </Tab>
        <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
          <OpenSourceTab
            key={index}
            initialPage={data.openSourceBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
        <Tab title="Others">
          Open Source
        </Tab>
      </Tabs>
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
    ezmeralBlogs: PropTypes.shape({
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
    spiffeBlogs: PropTypes.shape({
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
    allBlogsCount: PropTypes.objectOf(PropTypes.number),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.number),
    ezmeralBlogsCount: PropTypes.objectOf(PropTypes.number),
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
