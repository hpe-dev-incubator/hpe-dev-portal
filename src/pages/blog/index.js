import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Paragraph, Tab, Tabs, Menu, Text, Grommet, Box } from 'grommet';
import { FormDown } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
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

const customTheme = deepMerge(hpe, {
  tab: {
    pad: {
      vertical: '0',
      horizontal: '0',
    },
  },
});

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
  const [platformContent, setPlatformContent] = useState({
    key: 0,
    data: data.allBlogs,
  });
  /* eslint-disable-next-line no-unused-vars */
  const [blogPosition, setBlogPosition] = useLocalStorage('blogPosition');
  const [activeBlogTab, setActiveBlogTab] = useLocalStorage('activeBlogTab');
  const [dropDownData, setDropDownData] = useLocalStorage('dropDownData');
  const [activePlatform, setActivePlatform] = useLocalStorage('activePlatform');

  const platforms = {
    ezmeralBlogs: {
      label: 'HPE Ezmeral Container Platform',
      count: data.ezmeralBlogsCount.totalCount,
    },
    spiffeBlogs: {
      label: 'Spiffee and Spire Projects',
      count: data.spiffeBlogsCount.totalCount,
    },
    dataFabricBlogs: {
      label: 'HPE Ezmeral Data Fabric',
      count: data.dataFabricBlogsCount.totalCount,
    },
    greenlakeBlogs: {
      label: 'HPE GreenLake',
      count: data.greenlakeBlogsCount.totalCount,
    },
    chapelBlogs: {
      label: 'Chapel',
      count: data.chapelBlogsCount.totalCount,
    },
    grommetBlogs: {
      label: 'Grommet',
      count: data.grommetBlogsCount.totalCount,
    },
    alletraBlogs: {
      label: 'HPE Alletra',
      count: data.alletraBlogsCount.totalCount,
    },
    deepLearningBlogs: {
      label: 'HPE Deep Learning Cookbook',
      count: data.deepLearningBlogsCount.totalCount,
    },
    threeParBlogs: {
      label: 'HPE 3PAR and Primera',
      count: data.threeParBlogsCount.totalCount,
    },
    nimbleBlogs: {
      label: 'HPE Nimble Storage',
      count: data.nimbleBlogsCount.totalCount,
    },
    oneviewBlogs: {
      label: 'HPE OneView',
      count: data.oneviewBlogsCount.totalCount,
    },
    oneviewDashboardBlogs: {
      label: 'HPE OneView Global Dashboard',
      count: data.oneviewDashboardBlogsCount.totalCount,
    },
    iloBlogs: {
      label: 'iLO RESTful API',
      count: data.iloBlogsCount.totalCount,
    },
  };

  const platformsData = Object.entries(data)
    .filter((item) => Object.prototype.hasOwnProperty.call(platforms, item[0]))
    .map((item, i) => {
      return {
        label: `${platforms[item[0]].label} (${platforms[item[0]].count})`,
        active: platforms[item[0]].label === activePlatform,
        onClick: () => {
          setActiveBlogTab(index);
          setDropDownData(item[1]);
          setPlatformContent({ key: i, data: item[1] });
          setActivePlatform(platforms[item[0]].label);
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
      <Tabs activeIndex={index} onActive={onActive} justify="start" pad="20px">
        <Tab title={`All (${totalAllBlogsCount})`}>
          <BlogTabContent
            key={index}
            initialPage={data.allBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
        <Grommet theme={customTheme}>
          <Tab
            pad="none"
            title={
              <Menu
                open={activePlatform}
                dropProps={{
                  align: { top: 'bottom', left: 'left' },
                }}
                items={platformsData}
              >
                <Box
                  width="115px"
                  height="48px"
                  justify="center"
                  align="center"
                  direction="row"
                >
                  <Text color="black" margin={{ right: 'xsmall' }}>
                    Platforms
                  </Text>
                  <FormDown />
                </Box>
              </Menu>
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
        </Grommet>
        <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
          <BlogTabContent
            key={index}
            initialPage={data.openSourceBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
        <Tab title="Others">
          <BlogTabContent
            key={index}
            initialPage={data.othersBlogs}
            columns={columns}
            activeTab={index}
          />
        </Tab>
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
    othersBlogs: blogsPropType,
    allBlogsCount: PropTypes.objectOf(PropTypes.number),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.number),
    ezmeralBlogsCount: PropTypes.objectOf(PropTypes.number),
    spiffeBlogsCount: PropTypes.objectOf(PropTypes.number),
    dataFabricBlogsCount: PropTypes.objectOf(PropTypes.number),
    greenlakeBlogsCount: PropTypes.objectOf(PropTypes.number),
    chapelBlogsCount: PropTypes.objectOf(PropTypes.number),
    grommetBlogsCount: PropTypes.objectOf(PropTypes.number),
    alletraBlogsCount: PropTypes.objectOf(PropTypes.number),
    deepLearningBlogsCount: PropTypes.objectOf(PropTypes.number),
    threeParBlogsCount: PropTypes.objectOf(PropTypes.number),
    nimbleBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewDashboardBlogsCount: PropTypes.objectOf(PropTypes.number),
    iloBlogsCount: PropTypes.objectOf(PropTypes.number),
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
    dataFabricBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-ezmeral-data-fabric" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    dataFabricBlogs: paginatedCollectionPage(
      collection: { name: { eq: "data-fabric-posts" } }
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
    greenlakeBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-greenlake" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    greenlakeBlogs: paginatedCollectionPage(
      collection: { name: { eq: "greenlake-posts" } }
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
    chapelBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "chapel" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    chapelBlogs: paginatedCollectionPage(
      collection: { name: { eq: "chapel-posts" } }
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
    grommetBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "grommet" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    grommetBlogs: paginatedCollectionPage(
      collection: { name: { eq: "grommet-posts" } }
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
    alletraBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-alletra" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    alletraBlogs: paginatedCollectionPage(
      collection: { name: { eq: "alletra-posts" } }
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
    deepLearningBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "deep-learning-cookbook" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    deepLearningBlogs: paginatedCollectionPage(
      collection: { name: { eq: "deep-learning-posts" } }
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
    threeParBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-3par-and-primera" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    threeParBlogs: paginatedCollectionPage(
      collection: { name: { eq: "3par-posts" } }
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
    nimbleBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-nimble-storage" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    nimbleBlogs: paginatedCollectionPage(
      collection: { name: { eq: "nimble-posts" } }
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
    oneviewBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-oneview" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    oneviewBlogs: paginatedCollectionPage(
      collection: { name: { eq: "oneview-posts" } }
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
    oneviewDashboardBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-oneview-global-dashboard" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    oneviewDashboardBlogs: paginatedCollectionPage(
      collection: { name: { eq: "oneview-dashboard-posts" } }
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
    iloBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "ilo" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    iloBlogs: paginatedCollectionPage(
      collection: { name: { eq: "ilo-posts" } }
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
    othersBlogs: paginatedCollectionPage(
      collection: { name: { eq: "others-posts" } }
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
