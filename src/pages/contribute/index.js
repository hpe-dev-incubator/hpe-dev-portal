import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Box, Text, Heading, Card, Image, Markdown, Paragraph } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  HeroContent,
  Layout,
  SEO,
  ButtonLink,
  ReusableHeroSection,
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
  const { title, heroImage, heroDescription, templateCards } =
    post.frontmatter;

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
    <Layout title={siteTitle} fullWidth={true}>
      <SEO title={title} />
      <ReusableHeroSection
        image={heroImage}
        title={title}
        alt={`${title} hero banner`}
        height="auto"
        overlayGradient="linear-gradient(-46.42deg, rgba(41, 45, 58, 0) 15.577%, rgb(41, 45, 58) 73.294%)"
      >
        <Text size="large">{heroDescription}</Text>
      </ReusableHeroSection>
      <HeroContent gap="medium">
        <Markdown components={components}>{rawMarkdownBody}</Markdown>
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
                      alt={
                        card.templateType === 'Microsoft Word'
                          ? 'microsoft word doc icon'
                          : 'google docs icon'
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
      </HeroContent>
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
        heroImage: PropTypes.string,
        heroDescription: PropTypes.string,
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
        heroImage
        heroDescription
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
