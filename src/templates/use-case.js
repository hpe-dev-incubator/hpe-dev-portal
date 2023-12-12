import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Image } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  Content,
  Layout,
  Markdown,
  SEO,
  ButtonLink,
  SectionHeader,
  ResponsiveGrid,
  BlogCard,
} from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  max-width: 988px;
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

function UseCasesTemplate({ data }) {
  const post = data.markdownRemark;
  const { edges: blogs } = data.blogs;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title, image } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'large' }}>
            <Image
              width="216px"
              height="216px"
              src={image}
              alt="use cases logo"
            />
          </Box>
          <Content gap="medium" margin={{ vertical: 'large' }}>
            <Heading margin="none">{title}</Heading>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
            {blogs.length > 0 && (
              <SectionHeader title="Related Blogs" color="border">
                <ResponsiveGrid gap="large" rows={rows} columns={columns}>
                  {blogs.map(({ node }, i) => {
                    return node &&
                      (node.frontmatter.authorimage ||
                        node.frontmatter.author) ? (
                      <BlogCard node={node} key={i} margin="none" />
                    ) : undefined;
                  })}
                </ResponsiveGrid>
              </SectionHeader>
            )}
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Explore Use Cases Page"
            to="/use-cases"
          />
        </Box>
      </Box>
    </Layout>
  );
}

UseCasesTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        image: PropTypes.string,
      }).isRequired,
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
  }).isRequired,
};

export default UseCasesTemplate;

export const pageQuery = graphql`
  query UseCasesBySlug($slug: String!, $tagRE: String!) {
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
      sort: {frontmatter: {date: DESC}}
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
          }
          excerpt(format: PLAIN)
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
