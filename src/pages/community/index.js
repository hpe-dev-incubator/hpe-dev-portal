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
  large: ['auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};
function Community({ data }) {
  const communities = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Community" />
      <PageDescription
        image="/img/community/community.svg"
        title="Community"
        alt="community page logo"
      >
        <Paragraph size="large">
          A community is all about connection. Discover the many different ways
          you can connect with members of the HPE Developer Community here.
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
