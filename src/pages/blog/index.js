import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Paragraph, Box } from 'grommet';
import {
  BlogCard,
  Layout,
  SEO,
  PageDescription,
  FeaturedBlogCard,
  SectionHeader,
  ResponsiveGrid,
  ButtonLink,
  BlogTabs,
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
  /* eslint-disable no-unused-vars */
  const [index, setIndex] = useState(0);
  const [blogPosition, setBlogPosition] = useLocalStorage('blogPosition');
  /* eslint-disable no-unused-vars */

  useEffect(() => {
    if (location.state && location.state.isBlogHeaderClicked) {
      navigate('/blog', { replace: true });
      setIndex(0);
      localStorage.removeItem('blogPosition');
      localStorage.removeItem('blogData');
      localStorage.removeItem('activeBlogTab');
    }
  }, [location]);

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
        <Paragraph size="large">
          Sharing expertise is a great way to move technology forward. Browse
          through our library of tutorials and articles to learn new ways to do
          things. Or, click on the Get Started button to write your own!
        </Paragraph>
        <Box wrap align="start">
          <ButtonLink primary label="Get Started" to="/contribute" />
        </Box>
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
      <BlogTabs data={data} columns={columns} />
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
          disable: { ne: true }
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
            disable
            externalLink
            featuredBlog
          }
        }
      }
    }
    allBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { featuredBlog: { ne: true }, disable: { ne: true } }
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
    projectDataMapBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "project-data-map" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    projectDataMapBlogs: paginatedCollectionPage(
      collection: { name: { eq: "project-data-map-posts" } }
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
        frontmatter: { tags: { eq: "hpe-ezmeral" }, disable: { ne: true } }
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
    zertoBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "zerto" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    zertoBlogs: paginatedCollectionPage(
      collection: { name: { eq: "zerto-posts" } }
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
        frontmatter: {
          tags: { eq: "hpe-3par-and-primera" }
          disable: { ne: true }
        }
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
    arubaBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "aruba" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    arubaBlogs: paginatedCollectionPage(
      collection: { name: { eq: "aruba-posts" } }
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
        frontmatter: {
          tags: { eq: "hpe-oneview-global-dashboard" }
          disable: { ne: true }
        }
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
        frontmatter: {
          tags: {
            in: ["ilo", "Redfish", "ilorest", "iLOrest", "ilo-restful-api"]
          }
          disable: { ne: true }
        }
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
    dsccBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: {
          tags: { eq: "data-services-cloud-console" }
          disable: { ne: true }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    dsccBlogs: paginatedCollectionPage(
      collection: { name: { eq: "dscc-posts" } }
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
        frontmatter: {
          tags: { in: ["hpe-ezmeral-data-fabric", "MapR"] }
          disable: { ne: true }
        }
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
    alletraBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-alletra" }, disable: { ne: true } }
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
    nimbleBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: {
          tags: { eq: "hpe-nimble-storage" }
          disable: { ne: true }
        }
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
        frontmatter: { tags: { eq: "hpe-oneview" }, disable: { ne: true } }
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
    crayBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "cray" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    crayBlogs: paginatedCollectionPage(
      collection: { name: { eq: "cray-posts" } }
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
    swarmBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "swarm-learning" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    swarmBlogs: paginatedCollectionPage(
      collection: { name: { eq: "swarm-posts" } }
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
    hpeNonstopBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-nonstop" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    hpeNonstopBlogs: paginatedCollectionPage(
      collection: { name: { eq: "hpe-nonstop-posts" } }
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
    simplivityBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-simplivity" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    simplivityBlogs: paginatedCollectionPage(
      collection: { name: { eq: "simplivity-posts" } }
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
        frontmatter: { tags: { eq: "hpe-greenlake" }, disable: { ne: true } }
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
    kubeDirectorBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "kubedirector" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    kubeDirectorBlogs: paginatedCollectionPage(
      collection: { name: { eq: "kubedirector-posts" } }
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
        frontmatter: {
          tags: { eq: "spiffe-and-spire-projects" }
          disable: { ne: true }
        }
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
        frontmatter: { tags: { eq: "chapel" }, disable: { ne: true } }
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
        frontmatter: { tags: { eq: "grommet" }, disable: { ne: true } }
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
    smartSimBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "SmartSim" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    smartSimBlogs: paginatedCollectionPage(
      collection: { name: { eq: "smartsim-posts" } }
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
        frontmatter: {
          tags: { eq: "deep-learning-cookbook" }
          disable: { ne: true }
        }
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

    determinedBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "determined-ai" }, disable: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
    determinedBlogs: paginatedCollectionPage(
      collection: { name: { eq: "determined-ai-posts" } }
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
        frontmatter: { tags: { eq: "opensource" }, disable: { ne: true } }
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
    othersBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: {
          disable: { ne: true }
          tags: {
            nin: [
              "opensource"
              "hpe-ezmeral-container-platform"
              "hpe-ezmeral"
              "spiffe-and-spire-projects"
              "hpe-ezmeral-data-fabric"
              "hpe-greenlake"
              "chapel"
              "grommet"
              "hpe-alletra"
              "deep-learning-cookbook"
              "hpe-3par-and-primera"
              "hpe-nimble-storage"
              "hpe-oneview"
              "hpe-oneview-global-dashboard"
              "ilo"
              "data-services-cloud-console"
              "determined-ai"
              "cray"
            ]
          }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
    }
  }
`;
