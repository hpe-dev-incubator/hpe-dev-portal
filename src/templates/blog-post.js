import React from 'react';
import { Location } from '@reach/router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';

import {
  Content,
  Layout,
  Markdown,
  Link,
  ButtonLink,
  SEO,
  Share,
  BlogCard,
  SectionHeader,
  ResponsiveGrid,
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

const findImageURL = (body) => {
  // Find image url by Regex
  const foundByRegex = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/gi.exec(
    body,
  );
  if (foundByRegex) {
    const imageURL = foundByRegex[1].includes('https://')
      ? foundByRegex[1]
      : `https://developer.hpe.com${foundByRegex[1]}`;
    return imageURL;
  }

  // Find image url by tag
  const element = document.createElement('div');
  element.innerHTML = body;
  const foundByImageTag = element.querySelector('img');
  if (foundByImageTag) {
    console.log('foundByImageTag: ', foundByImageTag.src);
    const imageURL = foundByImageTag.src.includes('https://')
      ? foundByImageTag
      : `https://developer.hpe.com${foundByImageTag.getAttribute('src')}`;
    return imageURL;
  }

  return null;
};

function BlogPostTemplate({ data }) {
  const { post } = data;
  const blogsByTags = data.blogsByTags.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const dateFormat = Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const { rawMarkdownBody, excerpt } = post;
  const {
    description,
    date,
    title,
    author,
    tags,
    authorimage,
  } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO
        title={title}
        description={description || excerpt}
        image={findImageURL(rawMarkdownBody)}
      />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'medium' }} align="center">
            <Image
              width="192px"
              height="192px"
              src={authorimage}
              alt="author logo"
            />
          </Box>
          <Content gap="large" margin={{ vertical: 'large', right: '74px' }}>
            <Box gap="small">
              <Text size="xlarge" weight={500}>
                {author}
              </Text>
              <Heading margin="none">{title}</Heading>
              <Text size="xlarge">{dateFormat.format(new Date(date))}</Text>
              <Location>
                {({ location }) => {
                  return <Share url={location.href} text={title} />;
                }}
              </Location>
            </Box>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
            {tags && (
              <Box align="baseline" gap="small">
                <Heading level={2} margin={{ vertical: 'none' }}>
                  Tags
                </Heading>
                <Box direction="row-responsive" align="baseline">
                  {tags.map((tag, index) => (
                    <Link
                      to={`/blog/tag/${tag.toLowerCase().trim()}`}
                      key={tag}
                      size="xxlarge"
                    >
                      {(index ? ',' : '') + tag}
                    </Link>
                  ))}
                </Box>
              </Box>
            )}
            <SectionHeader title="Related" color="border">
              <ResponsiveGrid gap="large" rows={rows} columns={columns}>
                {blogsByTags.map((blogPost) =>
                  blogPost.url !== '/' &&
                  (blogPost.node.frontmatter.authorimage ||
                    blogPost.node.frontmatter.author) ? (
                    <BlogCard key={blogPost.node.id} node={blogPost.node} />
                  ) : undefined,
                )}
              </ResponsiveGrid>
            </SectionHeader>
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Blog Page"
            to="/blog"
          />
        </Box>
      </Box>
    </Layout>
  );
}

BlogPostTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    post: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        author: PropTypes.string,
        date: PropTypes.string,
        description: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        authorimage: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    blogsByTags: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string,
              tags: PropTypes.array,
              authorimage: PropTypes.string.isRequired,
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
  }).isRequired,
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $tagRE: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(format: MARKDOWN, pruneLength: 160)
      html
      rawMarkdownBody
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        description
        tags
        authorimage
        thumbnailimage
      }
    }

    blogsByTags: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { tags: { regex: $tagRE } }
      }
      sort: { fields: [frontmatter___priority], order: ASC }
      limit: 8
    ) {
      edges {
        node {
          id
          fields {
            slug
            sourceInstanceName
          }
          excerpt(format: MARKDOWN)
          frontmatter {
            title
            date
            author
            tags
            authorimage
            thumbnailimage
          }
          rawMarkdownBody
        }
      }
    }
  }
`;
