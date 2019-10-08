import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Anchor,
  Box,
  Heading,
  Markdown,
  Paragraph,
  Image as GrommetImage,
  Text,
} from 'grommet';
import { Github } from 'grommet-icons';
import { BlogCard, Content, Layout, SEO } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

class Image extends React.Component {
  render() {
    const { src } = this.props;
    return src === 'Github' ? (
      <Github color="brand" />
    ) : (
      <GrommetImage {...this.props} />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
};

const components = {
  p: {
    component: Paragraph,
    props: {
      size: 'xlarge',
      style: {
        maxWidth: '100%',
      },
    },
  },
  img: {
    component: Image,
    props: {
      style: {},
    },
  },
  hr: {
    component: Box,
    props: {
      border: {
        top: 'small',
        color: 'light-3',
      },
    },
  },
  a: {
    component: Anchor,
  },
};

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
  const { edges } = data.allMarkdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, description } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive" wrap>
          <Box pad={{ vertical: 'large', horizontal: 'large' }}>
            <Heading margin="none">{title}</Heading>
          </Box>
          <Content gap="medium" width="xlarge" margin={{ vertical: 'large' }}>
            <Text size="xlarge">{description}</Text>
            <MarkdownLayout components={components}>
              {rawMarkdownBody}
            </MarkdownLayout>
          </Content>
        </Box>
        <Box flex={false} direction="row-responsive" wrap>
          <Box pad={{ vertical: 'large', horizontal: 'large' }}>
            <Heading margin="none">Blog posts</Heading>
          </Box>
          <Content gap="medium" width="xlarge">
            {edges.map(({ node }) => {
              const { slug } = node.fields;
              return <BlogCard node={node} key={slug} margin="none" />;
            })}
          </Content>
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
      }).isRequired,
    }).isRequired,
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string,
              date: PropTypes.string,
              description: PropTypes.string.isRequired,
              version: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default PlatformTemplate;

export const pageQuery = graphql`
  query PlatformBySlug($slug: String!, $tags: [String!]) {
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
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: $tags } }
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
          excerpt
        }
      }
    }
  }
`;
