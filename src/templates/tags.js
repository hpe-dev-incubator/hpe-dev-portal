import React from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import { graphql } from 'gatsby';
import {
  BlogCard,
  Layout,
  SEO,
  SectionHeader,
  ResponsiveGrid,
  ButtonLink,
} from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

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

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`;

  return (
    <Layout title={siteTitle}>
      <SEO title="Tags" />
      <Box pad="xlarge">
        <SectionHeader title={tagHeader} color="yellow">
          <ResponsiveGrid gap="large" rows={rows} columns={columns}>
            {edges.map(
              (blogPost) =>
                blogPost.url !== '/' && (
                  <BlogCard
                    key={blogPost.node.fields.slug}
                    node={blogPost.node}
                  />
                ),
            )}
          </ResponsiveGrid>
          <Box alignSelf="start">
            <ButtonLink
              icon={<FormPreviousLink />}
              label="Go to All tags Page"
              to="/tags"
            />
          </Box>
        </SectionHeader>
      </Box>
    </Layout>
  );
};

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string,
              date: PropTypes.string,
              authorimage: PropTypes.string,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
            excerpt: PropTypes.string.isRequired,
          }),
        }).isRequired,
      ),
    }),
  }),
};

export default Tags;

export const pageQuery = graphql`
  query($tagRE: String) {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { regex: $tagRE }, disable: { ne: true } }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            sourceInstanceName
          }
          frontmatter {
            title
            author
            date
            externalLink
            authorimage
          }
          excerpt
        }
      }
    }
  }
`;
