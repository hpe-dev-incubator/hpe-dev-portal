import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  BlogCard,
  Content,
  Layout,
  Markdown,
  SEO,
  SectionHeader,
  ResponsiveGrid,
  ButtonLink,
  Card,
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

  .button {
    background-color: rgba(23, 235, 160, 1);
    box-sizing: border-box;
    color: #000000;
    font-size: 18px;
    display: inline-block;
    padding: 6px 12px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
    border: none;
    margin: 0;
    line-height: 24px;
    font-weight: 700;
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
  const { edges: events } = data.events;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, description, tags } = post.frontmatter;
  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'xlarge' }}>
            {/* <Image
                width="216px"
                height="216px"
                src={image}
                alt="platform logo"
              /> */}
          </Box>
          <Content gap="medium" margin={{ vertical: 'large' }}>
            <Heading margin="none">{title}</Heading>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
            {blogs.length > 0 && tags && (
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
            {events.length > 0 && tags && (
              <SectionHeader title="Related Events" color="border">
                {events.map(({ node }) => {
                  return (
                    node && (
                      <Card
                        key={node.id}
                        category={node.frontmatter.category}
                        width={node.frontmatter.width}
                        content={node.rawMarkdownBody}
                        link={node.frontmatter.link}
                        image={node.frontmatter.image}
                        basis="auto"
                      />
                    )
                  );
                })}
              </SectionHeader>
            )}
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Platforms Page"
            to="/platforms"
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
        tags: PropTypes.arrayOf(PropTypes.string),
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
              externalLink: PropTypes.string,
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
    events: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              link: PropTypes.string.isRequired,
              image: PropTypes.string,
              category: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
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
        tags
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
            externalLink
          }
          excerpt(format: MARKDOWN)
        }
      }
    }
    events: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { regex: $tagRE } }
        fields: { sourceInstanceName: { eq: "event" } }
        isUpcoming: { eq: true }
      }
    ) {
      totalCount
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
            image
            category
            dateEnd
            link
            width
          }
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
