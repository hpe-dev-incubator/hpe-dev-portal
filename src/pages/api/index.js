import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Paragraph } from 'grommet';
import {
  OpenSourceCard,
  Layout,
  SEO,
  PageDescription,
  ResponsiveGrid,
  SectionHeader,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

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

function ApiPage({ data }) {
  const projects = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Browse APIs" />
      <PageDescription
        image="/img/opensource/opensource.svg"
        title="Browse APIs"
        alignSelf="start"
        alt="api logo"
      >
        <Box gap="small">
          <Paragraph size="large">API Portal through redocly</Paragraph>
        </Box>
      </PageDescription>
      <SectionHeader color="green">
        <ResponsiveGrid gap="large" rows={rows} columns={columns}>
          {projects.map(({ node }) => (
            <OpenSourceCard
              key={node.id}
              title={node.frontmatter.title}
              description={node.frontmatter.description}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
              category={node.frontmatter.category}
            />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
    </Layout>
  );
}
ApiPage.propTypes = {
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
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
export default ApiPage;
export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "api" } } }
      sort: { order: ASC, fields: [frontmatter___priority] }
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
