import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text } from 'grommet';

import { Content, Layout, Markdown, SEO } from '../components';
import { Link } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

const EventButton = styled.a`
  display: inline-block;
  background-color: rgba(23, 235, 160, 1);
  color: #000000;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    background-color: rgba(13, 200, 135, 1);
  }
`;

const dateFormat = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDateRange(dateStart, dateEnd) {
  if (!dateStart) return null;
  const startStr = dateFormat.format(new Date(dateStart));
  if (!dateEnd) return startStr;
  const startDay = new Date(dateStart).toDateString();
  const endDay = new Date(dateEnd).toDateString();
  if (startDay === endDay) return startStr;
  return `${startStr} \u2013 ${dateFormat.format(new Date(dateEnd))}`;
}

function EventTemplate({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, tags, dateStart, dateEnd, link } = post.frontmatter;

  const dateString = formatDateRange(dateStart, dateEnd);
  const now = new Date();
  const isUpcoming = dateEnd ? new Date(dateEnd) > now : false;
  const isYouTube =
    link && (link.includes('youtube.com') || link.includes('youtu.be'));
  const showLink = link && (isUpcoming || isYouTube);
  const linkLabel = isUpcoming ? 'Register' : 'Watch recording';

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={excerpt} />
      <Box pad="large">
        <Content margin={{ vertical: 'large' }}>
          <Box gap="small" margin={{ bottom: 'medium' }}>
            <Heading level={1} margin="none">
              {title}
            </Heading>
            {dateString && (
              <Text size="large" color="#606A70">
                {dateString}
              </Text>
            )}
          </Box>
          <MarkdownLayout>{rawMarkdownBody}</MarkdownLayout>
          {showLink && (
            <Box margin={{ top: 'medium', bottom: 'small' }} align="start">
              <EventButton
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel}
              </EventButton>
            </Box>
          )}
          {tags && (
            <Box align="baseline" gap="small" margin={{ top: 'large' }}>
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
        </Content>
      </Box>
    </Layout>
  );
}

EventTemplate.propTypes = {
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
        dateStart: PropTypes.string,
        dateEnd: PropTypes.string,
        link: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventTemplate;

export const pageQuery = graphql`
  query EventsBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 260)
      rawMarkdownBody
      frontmatter {
        title
        tags
        dateStart
        dateEnd
        link
      }
    }
  }
`;
