import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Markdown, Paragraph, Text } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import {
  agendaTableOverrides,
  HeroContent,
  Layout,
  SEO,
  ButtonLink,
  ReusableHeroSection,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function OSScontribute({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title, heroImage, heroDescription } = post.frontmatter;

  const components = {
    ...agendaTableOverrides,
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
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Community Page"
            to="/community"
          />
        </Box>
      </HeroContent>
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
        heroImage: PropTypes.string,
        heroDescription: PropTypes.string,
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
        heroImage
        heroDescription
      }
      rawMarkdownBody
    }
  }
`;
