import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Text } from 'grommet';
import {
  Layout,
  ReusableHeroSection,
  ReusableInfoTilesRow,
  SEO,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Topics({ data }) {
  const topics = data.allMarkdownRemark.edges;
  const topicTiles = topics.map(({ node }) => ({
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    actionLabel: `Explore ${node.frontmatter.title} →`,
    actionHref: `/topic${node.fields.slug}`,
    variant: 'light',
  }));
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title="Topics" />
      <ReusableHeroSection
        image="/img/topics/TopicBg.jpg"
        title="Topics"
        alt="topics background"
        backgroundPosition="50% 33%"
        showRightMidGradient={true}
        height="auto"
      >
        <Text size="large">
          Explore curated resources across the most important technology areas
          for HPE developers.
        </Text>
      </ReusableHeroSection>
      <ReusableInfoTilesRow items={topicTiles} />
    </Layout>
  );
}

Topics.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }).isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Topics;

export const pageQuery = graphql`
  query TopicsIndexQuery {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "topic" } }
        frontmatter: { active: { eq: true } }
      }
      sort: { frontmatter: { priority: ASC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            priority
          }
        }
      }
    }
  }
`;
