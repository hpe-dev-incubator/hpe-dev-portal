import React from 'react';
import { Location } from '@reach/router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';

import {
  agendaTableOverrides,
  Content,
  HeroContent,
  Layout,
  Markdown,
  ReusableHeroSection,
  SEO,
  Share,
  ButtonLink,
} from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

const agendaMarkdownOptions = { overrides: agendaTableOverrides };


function CampaignTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, authorimage, author, heroImage, heroDescription } =
    post.frontmatter;

  if (heroImage) {
    return (
      <Layout title={siteTitle} fullWidth={true}>
        <SEO title={title} description={excerpt} />
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
          <MarkdownLayout options={agendaMarkdownOptions}>
            {rawMarkdownBody}
          </MarkdownLayout>
          <Box alignSelf="start">
            <ButtonLink
              icon={<FormPreviousLink />}
              label="Go to Training Page"
              to="/skillup"
            />
          </Box>
        </HeroContent>
      </Layout>
    );
  }

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box flex={false} direction="row-responsive">
          <Box
            pad={{ vertical: 'large', horizontal: 'medium' }}
            direction="column"
          >
            {authorimage && <Image src={authorimage} alt="author logo" />}
          </Box>
          <Content gap="large" margin={{ vertical: 'large' }}>
            <Box gap="small">
              <Text size="xlarge" weight={500}>
                {author}
              </Text>
              <Heading margin="none">{title}</Heading>
              <Location>
                {({ location }) => {
                  return <Share url={location.href} text={title} />;
                }}
              </Location>
            </Box>
            <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Training Page"
            to="/skillup"
          />
        </Box>
      </Box>
    </Layout>
  );
}

CampaignTemplate.propTypes = {
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
        authorimage: PropTypes.string,
        author: PropTypes.string,
        heroImage: PropTypes.string,
        heroDescription: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CampaignTemplate;

export const pageQuery = graphql`
  query CampaignBySlug($slug: String!) {
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
        authorimage
        author
        heroImage
        heroDescription
      }
    }
  }
`;
