import React from 'react';
import { Location } from '@reach/router';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';
import { Content, Layout, Link, SEO, Share } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

function Markdown({ content }) {
  const markup = { __html: content };
  return <div dangerouslySetInnerHTML={markup} />;
}

Markdown.propTypes = {
  content: PropTypes.string,
};

function BlogPostTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const dateFormat = Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const { html, excerpt } = post;
  const { description, date, title, author, tags } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description || excerpt} />
      <Box direction="row-responsive" pad="large">
        <Box gap="medium">
          <Text>{dateFormat.format(new Date(date))}</Text>
          <Heading margin="none">{title}</Heading>
          <Box direction="row" gap="small" align="center">
            <Box
              background={{
                image: 'url(/img/default-avatar-brand.svg)',
                size: 'contain',
              }}
              pad="medium"
            />
            <Text size="xlarge" weight={600}>
              {author}
            </Text>
          </Box>
          <Location>
            {({ location }) => {
              return <Share url={location.href} text={title} />;
            }}
          </Location>
        </Box>
        <Content margin={{ vertical: 'large' }}>
          <Markdown content={html} />
          {tags && (
            <Box direction="row-responsive" align="baseline" gap="small">
              <Heading level={2} margin={{ vertical: 'none' }}>
                Tags:
              </Heading>
              {tags.map(tag => (
                <Link to={`/blog/tag/${tag}`} key={tag} size="xxlarge">
                  {tag}
                </Link>
              ))}
            </Box>
          )}
        </Content>
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
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        author: PropTypes.string,
        date: PropTypes.string,
        description: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      rawMarkdownBody
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        description
        tags
      }
    }
  }
`;
