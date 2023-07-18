import React from 'react';
import { Location } from '@reach/router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Avatar } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import remark from 'remark';
import strip from 'strip-markdown';

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

const findThumbnailImage = (thumbnailimage) => {
  if (thumbnailimage) {
    const imageURL = thumbnailimage.includes('https://')
      ? thumbnailimage
      : `https://developer.hpe.com${thumbnailimage}`;
    return imageURL;
  }
  return null;
};

const findFirstImgInBody = (body) => {
  const foundImageByRegex =
    /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/gi.exec(
      body,
    ) || /src\s*=\s*"(.+?)"/gi.exec(body);
  if (foundImageByRegex) {
    const imageURL = foundImageByRegex[1].includes('https://')
      ? foundImageByRegex[1]
      : `https://developer.hpe.com${foundImageByRegex[1]}`;
    return imageURL;
  }
  return null;
};

const stripDescription = (markdown) => {
  let text = markdown;
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      text = file.contents;
    });
  return text.trim();
};

function BlogPostTemplate({ data }) {
  const { post } = data;
  const blogsByTags = data.blogsByTags.edges;
  const siteMetadata = useSiteMetadata();
  const { siteTitle, siteUrl } = siteMetadata;
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
    thumbnailimage,
  } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO
        title={title}
        description={stripDescription(description || excerpt)}
        image={
          findThumbnailImage(thumbnailimage) ||
          findFirstImgInBody(rawMarkdownBody)
        }
      />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'medium' }} align="center">
            <Box height="192px" width="192px">
              <Avatar size="120px" src={authorimage} alt="author logo" />
            </Box>
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
                  return (
                    <Share
                      url={`${siteUrl}${location.pathname}`}
                      text={title}
                    />
                  );
                }}
              </Location>
            </Box>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
            {tags && (
              <Box align="baseline" gap="small">
                <Heading level={2} margin={{ vertical: 'none' }}>
                  Tags
                </Heading>
                <Box
                  direction="row-responsive"
                  align="baseline"
                  style={{ display: 'inline-block' }}
                >
                  {tags.map((tag, index) => (
                    <Link
                      to={`/blog/tag/${tag.toLowerCase().trim()}`}
                      key={tag}
                      size="xxlarge"
                    >
                      {tag + (index !== tags.length - 1 ? ',' : '')}
                    </Link>
                  ))}
                </Box>
              </Box>
            )}
            <SectionHeader title="Related" color="border">
              <ResponsiveGrid gap="large" rows={rows} columns={columns}>
                {blogsByTags.map((blogPost) =>
                  (blogPost.url !== '/' &&
                    blogPost.node.frontmatter.authorimage) ||
                  blogPost.node.frontmatter.author ? (
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
        thumbnailimage: PropTypes.string,
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
            externalLink
          }
          rawMarkdownBody
        }
      }
    }
  }
`;
