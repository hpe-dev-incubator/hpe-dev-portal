import { graphql, navigate } from 'gatsby';
import { Text } from 'grommet';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import {
  Layout,
  ReusableHeroSection,
  ReusableInfoTilesRow,
  SEO,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Platform({ data, location }) {
  const platforms = data.allMarkdownRemark.edges;
  const platformTiles = platforms.map(({ node }) => ({
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    actionLabel: 'Learn more',
    actionHref: `/${node.fields.sourceInstanceName}${node.fields.slug}`,
    variant: 'dark',
  }));
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  useEffect(() => {
    if (location.state && location.state.isPlatformHeaderClicked) {
      navigate('/platforms', { replace: true });
      localStorage.removeItem('platformPosition');
    }
  }, [location]);

  useEffect(() => {
    const scrollPosition = JSON.parse(localStorage.getItem('platformPosition'));

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, left: 0, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title="Our Technologies" />
      <ReusableHeroSection
        image="/img/opensource/open-source-hero-bg.jpg"
        title="Our Technologies"
        alt="technology page logo"
        backgroundPosition="50% 33%"
      >
        <Text size="large">
          Supporting developers, data scientists, and architects is what we do.
          Find APIs, GitHub repositories and many of the other resources you
          need here.
        </Text>
      </ReusableHeroSection>
      <ReusableInfoTilesRow items={platformTiles} />
    </Layout>
  );
}

Platform.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              version: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              frontpage: PropTypes.bool,
              priority: PropTypes.number,
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
      isPlatformHeaderClicked: PropTypes.bool,
    }),
  }),
};

export default Platform;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: {
          sourceInstanceName: { eq: "platform" }
          slug: { regex: "//home/$/" }
        }
        frontmatter: { isAside: { ne: true }, active: { eq: true } }
      }
      sort: {frontmatter: {priority: ASC}}
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            version
            description
            image
            frontpage
            priority
            active
          }
        }
      }
    }
  }
`;
