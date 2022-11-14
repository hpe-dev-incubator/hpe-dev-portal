import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Heading, Paragraph } from 'grommet';

import {
  PageDescription,
  Layout,
  SEO,
  CommunityCard,
  SectionHeader,
  ResponsiveGrid,
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
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Skill Up" />
      <PageDescription
        image="/img/skillup/skill_up.svg"
        title="Skill Up"
        alt="skillup dev logo"
      >
        <Paragraph size="large">
          With technology constantly evolving, it can be challenging to keep up.
          Bookmark this page to access a great set of free technical training
          resources to expand your skill set.
        </Paragraph>
      </PageDescription>
      <SectionHeader>
        <ResponsiveGrid rows={rows} columns={columns}>
          {communities.map((community) => (
            <CommunityCard key={community.node.id} node={community.node} />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
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
      sort: { fields: [frontmatter___priority] }
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
