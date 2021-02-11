import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  BlogCard,
  Content,
  Layout,
  Markdown,
  SEO,
  Aside,
  SectionHeader,
  ResponsiveGrid,
  ButtonLink,
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

function PlatformTemplate({ data }) {
  const post = data.markdownRemark;
  const { edges: blogs } = data.blogs;
  const { rawMarkdownBody: aside } = data.aside ? data.aside : false;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, description, image } = post.frontmatter;
  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box
            pad={{ vertical: 'large', horizontal: 'large' }}
            direction="column"
          >
            <Image src={image} />
            {aside && <Aside>{aside}</Aside>}
          </Box>
          <Content gap="medium" margin={{ vertical: 'large' }}>
            <Heading margin="none">{title}</Heading>
            <Text size="xlarge">{description}</Text>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
            {blogs.length > 0 && (
              <SectionHeader title="Related Blogs" color="border">
                <ResponsiveGrid gap="large" rows={rows} columns={columns}>
                  {blogs.map(({ node }, i) => {
                    return <BlogCard node={node} key={i} margin="none" />;
                  })}
                </ResponsiveGrid>
              </SectionHeader>
            )}
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Platforms Page"
            to="/platform"
          />
        </Box>
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
        image: PropTypes.string,
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
              authorimage: PropTypes.string,
              path: PropTypes.string,
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
        image
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
            authorimage
            path
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
