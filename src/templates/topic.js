import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
  Anchor,
  Select,
  ResponsiveContext,
} from 'grommet';
import { FormNext, Play } from 'grommet-icons';
import { Layout, SEO, ButtonLink, Link } from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const dateFormat = Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const SOURCE_TYPE_LABELS = {
  blog: 'Blog',
  event: 'Event',
  platform: 'Platform',
  greenlake: 'Platform',
};

const FILTER_OPTIONS = [
  { label: 'All resources', value: 'all' },
  { label: 'Blogs', value: 'blog' },
  { label: 'Events', value: 'event' },
  { label: 'Platforms', value: 'platform' },
  { label: 'Multimedia', value: 'multimedia' },
];

const SORT_OPTIONS = ['Newest first', 'Oldest first'];

function VideoCard({ video }) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <Box
      round="small"
      overflow="hidden"
      elevation="small"
      onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
      style={{ cursor: 'pointer' }}
      focusIndicator={false}
    >
      <Box style={{ position: 'relative' }}>
        <img
          src={thumbnailUrl}
          alt={video.title}
          style={{
            width: '100%',
            display: 'block',
            aspectRatio: '16/9',
            objectFit: 'cover',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          align="center"
          justify="center"
          background={{ color: 'black', opacity: 'weak' }}
        >
          <Box
            pad="small"
            round="full"
            background={{ color: 'white', opacity: 'strong' }}
          >
            <Play size="small" color="brand" />
          </Box>
        </Box>
      </Box>
      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
        <Text size="xsmall" weight="bold" color="text">
          {video.title}
        </Text>
      </Box>
    </Box>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

function TopicTemplate({ data }) {
  const topic = data.markdownRemark;
  const size = React.useContext(ResponsiveContext);
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { title, description, ctaLabel, ctaLink, learnMoreLink, videos } =
    topic.frontmatter;

  const allResources = data.allMarkdownRemark.edges;
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('Newest first');

  const resourcesForDisplay = (() => {
    if (activeFilter === 'all' || activeFilter === 'multimedia')
      return allResources;
    if (activeFilter === 'platform') {
      return allResources.filter(
        ({ node }) =>
          node.fields.sourceInstanceName === 'platform' ||
          node.fields.sourceInstanceName === 'greenlake',
      );
    }
    return allResources.filter(
      ({ node }) => node.fields.sourceInstanceName === activeFilter,
    );
  })();

  const showResources = activeFilter !== 'multimedia';
  const showVideos = activeFilter === 'all' || activeFilter === 'multimedia';

  const sortedResourcesForDisplay = [...resourcesForDisplay].sort((a, b) => {
    const aDate = new Date(a.node.frontmatter.date || 0).getTime();
    const bDate = new Date(b.node.frontmatter.date || 0).getTime();
    return sortOrder === 'Oldest first' ? aDate - bDate : bDate - aDate;
  });

  const totalCount =
    activeFilter === 'all'
      ? allResources.length + (videos?.length || 0)
      : activeFilter === 'multimedia'
        ? videos?.length || 0
        : resourcesForDisplay.length;

  return (
    <Layout title={siteTitle} fullWidth>
      <SEO title={title} description={description} />
      <Box flex overflow="auto" gap="large">
        <Box
          background={{
            image: 'url(/img/topics/TopicBg.jpg)',
            size: 'cover',
            position: 'center',
          }}
        >
          <Box pad={{ horizontal: 'xlarge', vertical: 'large' }} gap="large">
            {/* Breadcrumb */}
            <Box direction="row" gap="xsmall" align="center">
              <Link to="/topics" size="small" color="white">
                Topic
              </Link>
              <Text size="small" color="white">
                /
              </Text>
              <Text size="small" color="white">
                {title}
              </Text>
            </Box>

            {/* Hero */}
            <Box gap="medium" width={{ max: 'large' }}>
              <Heading level={1} margin="none" size="large" color="white">
                {title}
              </Heading>
              <Text size="large" color="white">
                {description}
              </Text>
              <Box direction="row" wrap gap="medium" align="center">
                {ctaLabel && ctaLink && (
                  <ButtonLink
                    label={
                      <Text size="medium" weight="bold" color="dark-1">
                        {ctaLabel}
                      </Text>
                    }
                    icon={<FormNext size="small" color="dark-1" />}
                    reverse
                    to={ctaLink}
                    plain={false}
                    background={{ color: 'white' }}
                    border={{ color: 'black', size: 'xsmall' }}
                    round="full"
                    size="large"
                    pad={{ horizontal: 'large', vertical: 'medium' }}
                    gap="small"
                    style={{
                      borderRadius:
                        'var(--button-primary-medium-borderRadius, 9999px)',
                      background: 'var(--button-primary-rest-background, #FFF)',
                      opacity: 1,
                    }}
                  />
                )}
                {learnMoreLink && (
                  <Anchor
                    href={learnMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    label={
                      <Text size="medium" weight="bold" color="white">
                        Learn more
                      </Text>
                    }
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Resources + Videos section */}
        <Box pad={{ horizontal: 'xlarge', vertical: 'large' }}>
          <Box
            direction="row"
            justify="between"
            align="center"
            wrap
            margin={{ bottom: 'medium' }}
          >
            <Text size="xxlarge" weight="bold" margin="none">
              {totalCount} resource{totalCount !== 1 ? 's' : ''} for &ldquo;
              {title}&rdquo;
            </Text>
            <Box width={size === 'small' ? 'full' : 'small'}>
              <Select
                options={SORT_OPTIONS}
                value={sortOrder}
                onChange={({ option }) => setSortOrder(option)}
                size="medium"
              />
            </Box>
          </Box>

          <Box direction={size === 'small' ? 'column' : 'row'} gap="large">
            {/* Sidebar filters */}
            <Box
              flex={false}
              width={size === 'small' ? 'full' : '336px'}
              // gap="xsmall"
            >
              {FILTER_OPTIONS.map(({ label, value }) => (
                <Button
                  key={value}
                  plain
                  onClick={() => setActiveFilter(value)}
                  fill="horizontal"
                >
                  <Box
                    pad={{ top: 'medium', horizontal: 'medium' }}
                    round="16px"
                    background={
                      activeFilter === value
                        ? { color: 'black', opacity: 'xxsmall' }
                        : 'transparent'
                    }
                  >
                    <Text
                      size="medium"
                      weight={activeFilter === value ? 'bold' : 'normal'}
                      color="#606A70"
                    >
                      {label}
                    </Text>
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Content area */}
            <Box flex gap="large" width={size === 'small' ? 'full' : '1192px'}>
              {/* Resource list */}
              {showResources && (
                <Box gap="large">
                  {sortedResourcesForDisplay.length === 0 ? (
                    <Text color="text-weak">
                      No resources found for this filter.
                    </Text>
                  ) : (
                    sortedResourcesForDisplay.map(({ node }, index) => {
                      const {
                        title: resourceTitle,
                        date,
                        author,
                      } = node.frontmatter;
                      const { slug, sourceInstanceName } = node.fields;
                      const typeLabel =
                        SOURCE_TYPE_LABELS[sourceInstanceName] ||
                        sourceInstanceName;
                      const href = `/${sourceInstanceName}${slug}`;
                      const formattedDate = date
                        ? dateFormat.format(new Date(date))
                        : null;

                      return (
                        <Box
                          key={slug}
                          gap="medium"
                          pad={{ bottom: 'medium' }}
                          border={
                            index < sortedResourcesForDisplay.length - 1
                              ? {
                                  side: 'bottom',
                                  color: '#D4D8DB',
                                  size: 'xsmall',
                                }
                              : undefined
                          }
                        >
                          <Box
                            direction="row"
                            gap="small"
                            align="center"
                            wrap
                            pad={{ vertical: 'medium' }}
                            round="16px"
                            background={{ color: 'black', opacity: 'xxsmall' }}
                          >
                            {formattedDate && (
                              <Text size="medium" color="#606A70">
                                {formattedDate}
                              </Text>
                            )}
                            <Box width="1px" height="24px" background="#D4D8DB">
                              <Text size="xsmall" color="transparent">
                                |
                              </Text>
                            </Box>
                            <Text size="medium" color="#606A70">
                              {typeLabel}
                            </Text>
                            {author && (
                              <Text size="small" color="text-weak">
                                by {author}
                              </Text>
                            )}
                          </Box>
                          <Link to={href}>
                            <Text
                              size={size === 'small' ? 'xlarge' : 'xxlarge'}
                              weight="bold"
                              color="#292D3A"
                            >
                              {resourceTitle}
                            </Text>
                          </Link>
                          {node.excerpt && (
                            <Text
                              size={size === 'small' ? 'large' : 'xlarge'}
                              color="#606A70"
                            >
                              {node.excerpt}
                            </Text>
                          )}
                        </Box>
                      );
                    })
                  )}
                </Box>
              )}

              {/* Multimedia / Videos section */}
              {showVideos && videos && videos.length > 0 && (
                <Box gap="medium">
                  {activeFilter === 'all' && (
                    <Heading level={3} margin="none">
                      Multimedia
                    </Heading>
                  )}
                  <Grid
                    columns={{ count: 'fill', size: 'medium' }}
                    gap="medium"
                  >
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </Grid>
                  <Box>
                    <Anchor
                      href="https://www.youtube.com/playlist?list=PLtS6YX0YOX4fWMwKbp9blyI1GLdXlbWjY"
                      target="_blank"
                      rel="noopener noreferrer"
                      label="View full playlist on YouTube →"
                      size="small"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Back link */}
        <Box>
          <Link to="/topics" size="small">
            ← All Topics
          </Link>
        </Box>
      </Box>
    </Layout>
  );
}

TopicTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        ctaLabel: PropTypes.string,
        ctaLink: PropTypes.string,
        learnMoreLink: PropTypes.string,
        videos: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
          }),
        ),
      }).isRequired,
    }).isRequired,
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }).isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              date: PropTypes.string,
              tags: PropTypes.arrayOf(PropTypes.string),
              author: PropTypes.string,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default TopicTemplate;

export const pageQuery = graphql`
  query TopicTemplateQuery($slug: String!, $tagRE: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        description
        ctaLabel
        ctaLink
        learnMoreLink
        videos {
          id
          title
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: {
          sourceInstanceName: { in: ["blog", "event", "platform", "greenlake"] }
        }
        frontmatter: { tags: { regex: $tagRE }, disable: { ne: true } }
      }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
            sourceInstanceName
          }
          frontmatter {
            title
            date
            tags
            author
          }
        }
      }
    }
  }
`;
