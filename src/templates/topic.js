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
  Tag,
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

const TYPE_COLORS = {
  Blog: 'brand',
  Event: 'accent-2',
  Platform: 'accent-3',
};

const FILTER_OPTIONS = [
  { label: 'All resources', value: 'all' },
  { label: 'Blogs', value: 'blog' },
  { label: 'Events', value: 'event' },
  { label: 'Platforms', value: 'platform' },
  { label: 'Multimedia', value: 'multimedia' },
];

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
}

function TopicTemplate({ data }) {
  const topic = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { title, description, ctaLabel, ctaLink, learnMoreLink, videos } =
    topic.frontmatter;

  const allResources = data.allMarkdownRemark.edges;
  const [activeFilter, setActiveFilter] = useState('all');

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

  const totalCount =
    activeFilter === 'all'
      ? allResources.length + (videos?.length || 0)
      : activeFilter === 'multimedia'
      ? videos?.length || 0
      : resourcesForDisplay.length;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} description={description} />
      <Box
        flex
        overflow="auto"
        pad={{ horizontal: 'xlarge', vertical: 'large' }}
        gap="large"
      >
        {/* Breadcrumb */}
        <Box direction="row" gap="xsmall" align="center">
          <Link to="/topics" size="small" color="text-weak">
            Topic
          </Link>
          <Text size="small" color="text-weak">
            /
          </Text>
          <Text size="small">{title}</Text>
        </Box>

        {/* Hero */}
        <Box gap="medium" width={{ max: 'large' }}>
          <Heading level={1} margin="none" size="large">
            {title}
          </Heading>
          <Text size="large" color="text-weak">
            {description}
          </Text>
          <Box direction="row" gap="small" wrap>
            {ctaLabel && ctaLink && (
              <ButtonLink
                label={
                  <Box direction="row" align="center" gap="xsmall">
                    <Text>{ctaLabel}</Text>
                    <FormNext size="small" />
                  </Box>
                }
                to={ctaLink}
                primary
              />
            )}
            {learnMoreLink && (
              <Anchor
                href={learnMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                label="Learn more"
              />
            )}
          </Box>
        </Box>

        {/* Resources + Videos section */}
        <Box>
          <Text size="large" weight="bold" margin={{ bottom: 'medium' }}>
            {totalCount} resource{totalCount !== 1 ? 's' : ''} for
            &ldquo;{title}&rdquo;
          </Text>

          <Box direction="row-responsive" gap="large">
            {/* Sidebar filters */}
            <Box
              flex={false}
              width="small"
              gap="xsmall"
              pad={{ top: 'xsmall' }}
            >
              {FILTER_OPTIONS.map(({ label, value }) => (
                <Button
                  key={value}
                  plain
                  onClick={() => setActiveFilter(value)}
                >
                  <Box
                    pad={{ vertical: 'xsmall', horizontal: 'small' }}
                    round="small"
                    background={
                      activeFilter === value ? 'light-2' : 'transparent'
                    }
                  >
                    <Text
                      size="small"
                      weight={activeFilter === value ? 'bold' : 'normal'}
                      color={activeFilter === value ? 'brand' : 'text'}
                    >
                      {label}
                    </Text>
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Content area */}
            <Box flex gap="large">
              {/* Resource list */}
              {showResources && (
                <Box gap="small">
                  {resourcesForDisplay.length === 0 ? (
                    <Text color="text-weak">
                      No resources found for this filter.
                    </Text>
                  ) : (
                    resourcesForDisplay.map(({ node }) => {
                      const {
                        title: resourceTitle,
                        date,
                        tags,
                        author,
                      } = node.frontmatter;
                      const { slug, sourceInstanceName } = node.fields;
                      const typeLabel =
                        SOURCE_TYPE_LABELS[sourceInstanceName] ||
                        sourceInstanceName;
                      const badgeColor = TYPE_COLORS[typeLabel] || 'brand';
                      const href = `/${sourceInstanceName}${slug}`;
                      const formattedDate = date
                        ? dateFormat.format(new Date(date))
                        : null;

                      return (
                        <Box
                          key={slug}
                          pad="medium"
                          round="small"
                          border={{ color: 'border', size: 'small' }}
                          gap="xsmall"
                          elevation="xsmall"
                        >
                          <Box
                            direction="row"
                            gap="small"
                            align="center"
                            wrap
                          >
                            {formattedDate && (
                              <Text size="xsmall" color="text-weak">
                                {formattedDate}
                              </Text>
                            )}
                            <Box
                              pad={{
                                horizontal: 'small',
                                vertical: 'xxsmall',
                              }}
                              round="large"
                              background={badgeColor}
                            >
                              <Text
                                size="xsmall"
                                color="white"
                                weight="bold"
                              >
                                {typeLabel}
                              </Text>
                            </Box>
                            {author && (
                              <Text size="xsmall" color="text-weak">
                                by {author}
                              </Text>
                            )}
                          </Box>
                          <Link to={href}>
                            <Text weight="bold">{resourceTitle}</Text>
                          </Link>
                          {node.excerpt && (
                            <Text size="small" color="text-weak">
                              {node.excerpt}
                            </Text>
                          )}
                          {tags && tags.length > 0 && (
                            <Box
                              direction="row"
                              gap="xsmall"
                              wrap
                              margin={{ top: 'xsmall' }}
                            >
                              {tags.slice(0, 5).map((tag) => (
                                <Tag key={tag} name={tag} size="small" />
                              ))}
                            </Box>
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
          sourceInstanceName: {
            in: ["blog", "event", "platform", "greenlake"]
          }
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
