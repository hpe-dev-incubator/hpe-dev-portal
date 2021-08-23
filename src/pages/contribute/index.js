import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Box, Text, Heading, Card, Image, Anchor } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  Content,
  Layout,
  Markdown,
  SEO,
  ButtonLink,
  PageDescription,
  ResponsiveGrid,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

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
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Contribute({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title } = post.frontmatter;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <PageDescription
        image="/img/community/contribute_248px.svg"
        title={title}
        alt="blog page logo"
      >
        <Text size="xxlarge" margin={{ top: 'small' }}>
          Sharing expertise is a great way to move technology forward.
        </Text>
        <Text size="xxlarge" margin={{ bottom: 'medium' }}>
          We want to hear from you.
        </Text>
        <Text size="xxlarge" margin={{ top: 'small', bottom: 'medium' }}>
          Follow the simple steps below to contribute to the HPE Developer blog.
        </Text>
        <Content gap="large" margin={{ vertical: 'medium' }} width="large">
          <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
        </Content>
        <Box
          border={{ side: 'horizontal', size: 'small' }}
          pad={{ top: 'small', bottom: 'large' }}
        >
          <Heading level="3">
            Take advantage of the blog templates offered here:
          </Heading>
          <Box width="850px">
            <ResponsiveGrid rows={rows} columns={columns} margin="0">
              <Card
                pad="medium"
                direction="row"
                align="center"
                elevation="medium"
                onClick={() =>
                  navigate(
                    'https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/8/HPE-DEV-TECHNICAL-TUTORIAL-TEMPLATE-FINAL.docx',
                  )
                }
              >
                <Box height="75px" width="75px">
                  <Image src="/img/community/microsoft-word-icon.svg" />
                </Box>
                <Box pad={{ left: 'medium' }}>
                  <Text size="large" weight="bold">
                    Microsoft Word
                  </Text>
                  <Text size="large" weight="bold">
                    Technical tutorial template
                  </Text>
                </Box>
              </Card>
              <Card
                pad="medium"
                direction="row"
                align="center"
                elevation="medium"
                onClick={() =>
                  navigate(
                    'https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/8/HPE-DEV-BASIC-BLOG-TEMPLATE-FINAL.docx',
                  )
                }
              >
                <Box height="75px" width="75px">
                  <Image src="/img/community/microsoft-word-icon.svg" />
                </Box>
                <Box pad={{ left: 'medium' }}>
                  <Text size="large" weight="bold">
                    Microsoft Word
                  </Text>
                  <Text size="large" weight="bold">
                    Basic Blog Template
                  </Text>
                </Box>
              </Card>
              <Card
                pad="medium"
                direction="row"
                align="center"
                elevation="medium"
                onClick={() =>
                  navigate(
                    'https://docs.google.com/document/d/1bY0QL0TYgQtzjCF4JpsLbDMvPUMarIwQoVZFjQYej1Y/edit',
                  )
                }
              >
                <Box height="75px" width="75px">
                  <Image src="/img/community/google-docs-icon.svg" />
                </Box>
                <Box pad={{ left: 'medium' }}>
                  <Text size="large" weight="bold">
                    Google Docs
                  </Text>
                  <Text size="large" weight="bold">
                    Technical tutorial template
                  </Text>
                </Box>
              </Card>
              <Card
                pad="medium"
                direction="row"
                align="center"
                elevation="medium"
                onClick={() =>
                  navigate(
                    'https://docs.google.com/document/d/1uAHcsJxavfmC0oRoccjBFI_WmuALDWhOINATiCEoDIw/edit',
                  )
                }
              >
                <Box height="75px" width="75px">
                  <Image src="/img/community/google-docs-icon.svg" />
                </Box>
                <Box pad={{ left: 'medium' }}>
                  <Text size="large" weight="bold">
                    Google Docs
                  </Text>
                  <Text size="large" weight="bold">
                    Basic Blog Template
                  </Text>
                </Box>
              </Card>
            </ResponsiveGrid>
          </Box>
        </Box>
        <Heading level="3">Questions?</Heading>
        <Text size="27px" margin={{ bottom: 'medium' }}>
          Feel free to reach out to us via{' '}
          <Anchor href="mailto:hpedev@hpe.com">email</Anchor>
          or through our{' '}
          <Anchor href="https://slack.hpedev.io/">HPE DEV Slack channel</Anchor>
          .
        </Text>
      </PageDescription>
      <Box alignSelf="start">
        <ButtonLink
          icon={<FormPreviousLink />}
          label="Go to Blog Page"
          to="/blog"
        />
      </Box>
    </Layout>
  );
}

Contribute.propTypes = {
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

export default Contribute;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { sourceInstanceName: { eq: "contribute" } }) {
      id
      frontmatter {
        title
      }
      rawMarkdownBody
    }
  }
`;
