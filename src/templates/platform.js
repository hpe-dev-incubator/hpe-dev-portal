import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';
import {
  BlogCard,
  Content,
  Layout,
  Markdown,
  SEO,
  Link,
  Aside,
} from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

function PlatformTemplate({ data }) {
  const post = data.markdownRemark;
  const { slug } = post.fields;
  const { edges: blogs } = data.blogs;
  const { rawMarkdownBody: aside } = data.aside ? data.aside : false;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, description } = post.frontmatter;
  const homeRoute = `/platform/${slug.split('/')[1]}/home`;
  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box
            pad={{ vertical: 'large', horizontal: 'large' }}
            direction="column"
          >
            <Link to={homeRoute}>
              <Heading
                margin={{
                  bottom: 'medium',
                  left: 'none',
                  right: 'none',
                  top: 'none',
                }}
              >
                {title}
              </Heading>
            </Link>
            {aside && <Aside>{aside}</Aside>}
          </Box>
          <Content gap="medium" width="large" margin={{ vertical: 'large' }}>
            <Text size="xlarge">{description}</Text>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          </Content>
        </Box>
        {blogs.length > 0 && (
          <Box flex={false} direction="row-responsive" wrap>
            <Box pad={{ vertical: 'large', horizontal: 'large' }}>
              <Heading margin="none">Blog posts</Heading>
            </Box>
            <Content gap="medium" width="xlarge">
              {blogs.map(({ node }, i) => {
                return <BlogCard node={node} key={i} margin="none" />;
              })}
            </Content>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

PlatformTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        version: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
      fields: PropTypes.shape({
        slug: PropTypes.string.isRequired,
      }),
    }).isRequired,
    blogs: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string,
              date: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }),
      ),
    }),
    aside: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        isAside: PropTypes.bool,
      }),
    }),
  }).isRequired,
};

export default PlatformTemplate;

export const pageQuery = graphql`
  query PlatformBySlug($slug: String!, $tagRE: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      rawMarkdownBody
      frontmatter {
        title
        version
        description
      }
      fields {
        slug
      }
    }
    blogs: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { regex: $tagRE } }
        fields: { sourceInstanceName: { eq: "blog" } }
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
          }
          excerpt(format: MARKDOWN)
        }
      }
    }
    aside: markdownRemark(
      frontmatter: { tags: { regex: $tagRE }, isAside: { eq: true } }
    ) {
      id
      excerpt
      rawMarkdownBody
    }
  }
`;
