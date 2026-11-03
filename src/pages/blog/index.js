import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Text } from 'grommet';
import styled from 'styled-components';
import {
  BlogTabs,
  ButtonLink,
  FeaturedBlogsSection,
  Layout,
  ReusableHeroSection,
  SEO,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { useLocalStorage } from '../../hooks/use-local-storage';

const ListingSection = styled.section`
  background: #f7f7f7;
  padding: 64px max(24px, 8.33%, calc((100% - 1600px) / 2)) 96px;

  @media (max-width: 768px) {
    padding: 40px 24px 64px;
  }
`;

function Blog({ data, location }) {
  const featuredposts = data.featuredblogs.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  /* eslint-disable no-unused-vars */
  const [blogPosition, setBlogPosition] = useLocalStorage('blogPosition');
  /* eslint-enable no-unused-vars */
  const [isActiveTab, setIsActiveTab] = useState(false);

  useEffect(() => {
    if (location.state && location.state.isBlogHeaderClicked) {
      navigate('/blog', { replace: true });
      localStorage.removeItem('blogPosition');
      localStorage.removeItem('blogData');
      localStorage.removeItem('activeBlogTab');
    }
  }, [location]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const activeTab = queryParams.get('activeTab');
    if (activeTab) setIsActiveTab(true);
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
  }, [blogPosition, isActiveTab]);

  return (
    <Layout title={siteTitle} fullWidth>
      <SEO title="Blog" />
      <ReusableHeroSection
        image="/img/blogs/blog-hero-bg.jpg"
        title="Blog"
        alt="blog page background"
        backgroundPosition="50% 33%"
        showRightMidGradient
        height="auto"
      >
        <Text size="large">
          Sharing expertise is a great way to move technology forward. Browse
          through our library of tutorials and articles to learn new ways to do
          things. Or, click on the Get Started button to write your own!
        </Text>
        <ButtonLink
          primary
          label="Get Started"
          to="/contribute"
          alignSelf="start"
          margin={{ top: 'medium' }}
        />
      </ReusableHeroSection>
      {featuredposts && featuredposts.length > 0 && !isActiveTab && (
        <FeaturedBlogsSection blogs={featuredposts} />
      )}
      <ListingSection>
        <BlogTabs data={data} />
      </ListingSection>
    </Layout>
  );
}

const paginatedPagePropType = PropTypes.shape({
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  hasNextPage: PropTypes.bool,
});

const countPropType = PropTypes.shape({ totalCount: PropTypes.number });

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
    allBlogs: paginatedPagePropType,
    greenlakeBlogs: paginatedPagePropType,
    openSourceBlogs: paginatedPagePropType,
    featuredBlogs: paginatedPagePropType,
    othersBlogs: paginatedPagePropType,
    allBlogsCount: countPropType,
    greenlakeBlogsCount: countPropType,
    openSourceBlogsCount: countPropType,
    featuredBlogsCount: countPropType,
    othersBlogsCount: countPropType,
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
          priority: { lte: 10, gte: 1 }
          disable: { ne: true }
        }
      }
      sort: { frontmatter: { priority: ASC } }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt(pruneLength: 220)
          frontmatter {
            title
            date
            description
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
        frontmatter: { disable: { ne: true } }
      }
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
    greenlakeBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "hpe-greenlake" }, disable: { ne: true } }
      }
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
    openSourceBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { eq: "opensource" }, disable: { ne: true } }
      }
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
    featuredBlogsCount: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { featuredBlog: { eq: true }, disable: { ne: true } }
      }
    ) {
      totalCount
    }
    featuredBlogs: paginatedCollectionPage(
      collection: { name: { eq: "featured-posts" } }
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
    ) {
      totalCount
    }
  }
`;
