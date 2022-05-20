import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Markdown, Paragraph } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  Content,
  Layout,
  SEO,
  ButtonLink,
  PageDescription,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function OSScontribute({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title } = post.frontmatter;

  const components = {
    p: {
      component: Paragraph,
      props: {
        style: {
          maxWidth: '100%',
        },
      },
    },
  };

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <PageDescription
        image="/img/community/contribute_248px.svg"
        title={title}
        alt="oss contribute page logo"
      >
        <Content width="large">
          <Markdown components={components}>{rawMarkdownBody}</Markdown>
        </Content>
      </PageDescription>
      <Box alignSelf="start">
        <ButtonLink
          icon={<FormPreviousLink />}
          label="Go to Community Page"
          to="/community"
        />
      </Box>
    </Layout>
  );
}

OSScontribute.propTypes = {
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
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default OSScontribute;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { sourceInstanceName: { eq: "osscontribute" } }) {
      id
      frontmatter {
        title
      }
      rawMarkdownBody
    }
  }
`;
