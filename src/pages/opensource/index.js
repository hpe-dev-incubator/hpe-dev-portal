import { graphql } from 'gatsby';
import React from 'react';
import { Text } from 'grommet';
import PropTypes from 'prop-types';
import {
  Layout,
  ReusableHeroSection,
  ReusableInfoTilesRow,
  SEO,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Opensource({ data }) {
  const projects = data.allMarkdownRemark.edges;
  const openSourceTiles = projects.map(({ node }) => ({
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    actionLabel: node.frontmatter.linkname || 'Learn more',
    actionHref: node.frontmatter.link,
    variant: 'light',
    category: node.frontmatter.category,
  }));
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
   
  return (
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title="Open Source" />
      <ReusableHeroSection
        image="/img/opensource/open-source-hero-bg.jpg"
        title="Open Source"
        alt="opensource logo"
        backgroundPosition="50% 33%"
        showRightMidGradient={true}
      >
        <Text size="large">
          Dedicated to innovation through collaboration, HPE is proud to lead
          and contribute to many open source projects. Learn more about these
          projects here.
        </Text>
      </ReusableHeroSection>
      <ReusableInfoTilesRow items={openSourceTiles} />
    </Layout>
  );
}

Opensource.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              category: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              priority: PropTypes.number,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              // slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
export default Opensource;
export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "opensource" } }
        frontmatter: { active: { eq: true } }
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
            category
            description
            link
            image
            priority
          }
        }
      }
    }
  }
`;
