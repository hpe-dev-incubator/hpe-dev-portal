import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Box, Text, Heading, Card, Image, Markdown, Paragraph } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  Content,
  Layout,
  SEO,
  ButtonLink,
  PageDescription,
  ResponsiveGrid,
  Questions,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

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
  const { title, templateCards } = post.frontmatter;

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
        alt="blog page logo"
      >
        <Text size="large" margin={{ top: 'small' }}>
          Sharing expertise is a great way to move technology forward.
        </Text>
        <Text size="large" margin={{ bottom: 'medium' }}>
          We want to hear from you.
        </Text>
        <Text size="large" weight="bold" margin={{ bottom: '-15px' }}>
          Follow the simple steps below to contribute to the HPE Developer blog.
        </Text>
        <Content width="large">
          <Markdown components={components}>{rawMarkdownBody}</Markdown>
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
              {templateCards.map((card, i) => (
                <Card
                  key={i}
                  pad="medium"
                  direction="row"
                  align="center"
                  elevation="medium"
                  onClick={() => navigate(`${card.link}`)}
                >
                  <Box height="75px" width="75px">
                    <Image
                      s
                      src={
                        card.templateType === 'Microsoft Word'
                          ? '/img/community/microsoft-word-icon.svg'
                          : '/img/community/google-docs-icon.svg'
                      }
                    />
                  </Box>
                  <Box pad={{ left: 'medium' }} width="medium">
                    <Text size="large" weight="bold">
                      {card.templateType}
                    </Text>
                    <Text size="large" weight="bold">
                      {card.templateName}
                    </Text>
                  </Box>
                </Card>
              ))}
            </ResponsiveGrid>
          </Box>
        </Box>
        <Questions />
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
        templateCards: PropTypes.arrayOf(
          PropTypes.shape({
            templateType: PropTypes.string,
            templateName: PropTypes.string,
            link: PropTypes.string,
          }),
        ),
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
        templateCards {
          link
          templateName
          templateType
        }
      }
      rawMarkdownBody
    }
  }
`;
