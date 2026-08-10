import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Heading, Text } from 'grommet';

import {
  Layout,
  ReusableInfoTilesRow,
  SEO,
  TrainingHeroSection,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

function Community({ data }) {
  const communities = data.allMarkdownRemark.edges;
  const communityTiles = communities.map((community) => ({
    title: community.node.frontmatter.title,
    description: community.node.frontmatter.description,
    actionLabel: community.node.frontmatter.linkname || 'Learn more',
    actionHref: community.node.frontmatter.link,
    variant: 'light',
  }));
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title="Community" />
      <TrainingHeroSection
        image="/img/community/community_hero_bg.jpg"
        title="Community"
        alt="community page logo"
        backgroundPosition="50% 33%"
      >
        <Text size="large">
          A community is all about connection. Discover the many different ways
          you can connect<br/> with members of the HPE Developer Community here.
        </Text>
      </TrainingHeroSection>
      <ReusableInfoTilesRow items={communityTiles} />
    </Layout>
  );
}

Community.propTypes = {
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

export default Community;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "community" } }
        frontmatter: { active: { eq: true } }
      }
      sort: {frontmatter: {priority: ASC}}
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
            active
          }
        }
      }
    }
  }
`;
