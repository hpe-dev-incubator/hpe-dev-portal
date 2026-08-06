import React from 'react';
import { graphql } from 'gatsby';
import { Heading, Text } from 'grommet';
import PropTypes from 'prop-types';

import {
  Layout,
  ReusableInfoTilesRow,
  SEO,
  TrainingHeroSection
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Skillup({ data }) {
  const communities = data.allMarkdownRemark.edges;
  const learningTiles = communities.map((community) => ({
    title: community.node.frontmatter.title,
    description: community.node.frontmatter.description,
    actionLabel: community.node.frontmatter.linkname || 'Learn more',
    actionHref: community.node.frontmatter.link,
    variant: 'dark',
  }));
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title="Training" />
      <TrainingHeroSection
        image="/img/skillup/training_bg.jpg"
        title="Training"
        alt="training dev logo"
      >
        <Text size="large">
          With technology constantly evolving, it can be challenging to keep up. Bookmark this<br />
          page to access a great set of free technical training resources to expand your skill set.
        </Text>
      </TrainingHeroSection>
      <ReusableInfoTilesRow
        items={learningTiles}
      />
    </Layout>
  );
}

Skillup.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              link: PropTypes.string,
              linkname: PropTypes.string,
              priority: PropTypes.number,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Skillup;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "skillup" } }
        frontmatter: { disable: { ne: true } }
      }
      sort: { frontmatter: { priority: ASC } }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            link
            description
            image
            linkname
            priority
            disable
          }
        }
      }
    }
  }
`;
