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
import { LinkNext, Play } from 'grommet-icons';
import {
  Layout,
  SEO,
  ButtonLink,
  ExternalButtonLink,
  Link,
} from '../components';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import {
  HeroBanner,
  HeroBgImage,
  HeroGradient,
  HeroContent,
  BreadcrumbRow,
  BreadcrumbText,
  HeroBody,
  HeroTitle,
  HeroDescription,
  CtaRow,
  VideoCardWrapper,
  VideoThumbnail,
  VideoOverlay,
  VideoPlayButton,
  VideoCardBody,
  VideoCardTitle,
  VideoAuthorRow,
  VideoAuthorAvatar,
  VideoAuthorName,
  VideoWatchLink,
  VideoGrid,
} from './topic.styles';

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

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function VideoCard({ video }) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  const videoUrl =
    video.youtubelink || `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <VideoCardWrapper
      onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === 'Enter' || e.key === ' ') &&
        window.open(videoUrl, '_blank', 'noopener,noreferrer')
      }
    >
      <VideoThumbnail>
        <img src={thumbnailUrl} alt={video.title} />
        <VideoOverlay>
          <VideoPlayButton>
            <Play color="#01a982" size="20px" />
          </VideoPlayButton>
        </VideoOverlay>
      </VideoThumbnail>

      <VideoCardBody>
        <VideoCardTitle className="video-title">{video.title}</VideoCardTitle>
        {video.author && (
          <VideoAuthorRow>
            <VideoAuthorAvatar>
              {video.authorimage ? (
                <img src={video.authorimage} alt={video.author} />
              ) : (
                <span>{getInitials(video.author)}</span>
              )}
            </VideoAuthorAvatar>
            <VideoAuthorName>by {video.author}</VideoAuthorName>
          </VideoAuthorRow>
        )}
        <VideoWatchLink
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Watch now
          <LinkNext color="#01a982" size="20px" />
        </VideoWatchLink>
      </VideoCardBody>
    </VideoCardWrapper>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    authorimage: PropTypes.string,
    youtubelink: PropTypes.string,
  }).isRequired,
};

function TopicTemplate({ data }) {
  const topic = data.markdownRemark;
  const size = React.useContext(ResponsiveContext);
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { title, description, ctaLabel, ctaLink, learnMoreLink } =
    topic.frontmatter;

  const allResources = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.sourceInstanceName !== 'video',
  );
  const videoEdges = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.sourceInstanceName === 'video',
  );
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('Newest first');

  const resourcesForDisplay = (() => {
    if (activeFilter === 'all' || activeFilter === 'multimedia')
      return allResources;
    if (activeFilter === 'platform') {
      return allResources.filter(
        ({ node }) =>
          (node.fields.sourceInstanceName === 'platform' ||
            node.fields.sourceInstanceName === 'greenlake') &&
          node.frontmatter.active !== false,
      );
    }
    return allResources.filter(
      ({ node }) => node.fields.sourceInstanceName === activeFilter,
    );
  })();

  const showResources = activeFilter !== 'multimedia';
  const showVideos = activeFilter === 'all' || activeFilter === 'multimedia';

  const videos = [...videoEdges]
    .sort((a, b) => {
      const aDate = new Date(
        a.node.frontmatter.date || a.node.frontmatter.dateStart || 0,
      ).getTime();
      const bDate = new Date(
        b.node.frontmatter.date || b.node.frontmatter.dateStart || 0,
      ).getTime();
      return sortOrder === 'Oldest first' ? aDate - bDate : bDate - aDate;
    })
    .map(({ node }) => ({
      id: node.frontmatter.youtubeid,
      title: node.frontmatter.title,
      author: node.frontmatter.author,
      authorimage: node.frontmatter.authorimage,
      youtubelink: node.frontmatter.youtubelink,
      date: node.frontmatter.date,
    }));

  const sortedResourcesForDisplay = (() => {
    const arr = [...resourcesForDisplay];
    // For events with default sort: upcoming first (ascending), then recent past (descending)
    if (activeFilter === 'event' && sortOrder !== 'Oldest first') {
      const now = new Date();
      const upcoming = arr
        .filter((r) => new Date(r.node.frontmatter.dateStart || 0) >= now)
        .sort(
          (a, b) =>
            new Date(a.node.frontmatter.dateStart || 0) -
            new Date(b.node.frontmatter.dateStart || 0),
        );
      const past = arr
        .filter((r) => new Date(r.node.frontmatter.dateStart || 0) < now)
        .sort(
          (a, b) =>
            new Date(b.node.frontmatter.dateStart || 0) -
            new Date(a.node.frontmatter.dateStart || 0),
        );
      return [...upcoming, ...past];
    }
    return arr.sort((a, b) => {
      const aDate = new Date(
        a.node.frontmatter.date || a.node.frontmatter.dateStart || 0,
      ).getTime();
      const bDate = new Date(
        b.node.frontmatter.date || b.node.frontmatter.dateStart || 0,
      ).getTime();
      return sortOrder === 'Oldest first' ? aDate - bDate : bDate - aDate;
    });
  })();

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
        <HeroBanner>
          {/* Background image at 30% opacity */}
          <HeroBgImage
            src="/img/topics/TopicBg.jpg"
            aria-hidden="true"
            alt=""
          />
          {/* Right-side gradient overlay */}
          <HeroGradient aria-hidden="true" />
          {/* Content */}
          <HeroContent>
            {/* Breadcrumb */}
            <BreadcrumbRow>
              <img
                src="/img/topics/sparkle.png"
                width="32"
                height="31"
                aria-hidden="true"
                alt=""
              />
              <BreadcrumbText>Topic / {title}</BreadcrumbText>
            </BreadcrumbRow>

            {/* Hero */}
            <HeroBody>
              <HeroTitle>{title}</HeroTitle>
              <HeroDescription>{description}</HeroDescription>
              <CtaRow>
                {ctaLabel &&
                  ctaLink &&
                  (() => {
                    const CtaBtn = ctaLink.startsWith('http')
                      ? ExternalButtonLink
                      : ButtonLink;
                    return (
                      <CtaBtn
                        label={
                          <Text size="20px" color="dark-1">
                            {ctaLabel}
                          </Text>
                        }
                        icon={<LinkNext size="20px" color="dark-1" />}
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
                          background:
                            'var(--button-primary-rest-background, #FFF)',
                          opacity: 1,
                        }}
                      />
                    );
                  })()}
                {learnMoreLink && (
                  <Anchor
                    href={learnMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    label={
                      <Text size="20px" color="white">
                        Learn more
                      </Text>
                    }
                  />
                )}
              </CtaRow>
            </HeroBody>
          </HeroContent>
        </HeroBanner>

        {/* Resources + Videos section */}
        <Box
          pad={{ vertical: 'large' }}
          style={{
            paddingLeft: 'max(24px, calc((100% - 1600px) / 2))',
            paddingRight: 'max(24px, calc((100% - 1600px) / 2))',
          }}
        >
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

          <Box direction={size === 'small' ? 'column' : 'row'} gap="72px">
            {/* Sidebar filters */}
            <Box flex={false} width={size === 'small' ? 'full' : '336px'}>
              {FILTER_OPTIONS.map(({ label, value }) => (
                <Button
                  key={value}
                  plain
                  onClick={() => setActiveFilter(value)}
                  fill="horizontal"
                >
                  <Box
                    pad={{ vertical: '20px', horizontal: '24px' }}
                    round="16px"
                    background={
                      activeFilter === value
                        ? 'rgba(0,0,0,0.04)'
                        : 'transparent'
                    }
                    data-testid={`filter-${value}`}
                  >
                    <Text
                      size="20px"
                      weight={activeFilter === value ? '500' : 'normal'}
                      color={activeFilter === value ? '#292d3a' : '#606A70'}
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
                        dateStart,
                        author,
                        externalLink,
                      } = node.frontmatter;
                      const { slug, sourceInstanceName } = node.fields;
                      const typeLabel =
                        SOURCE_TYPE_LABELS[sourceInstanceName] ||
                        sourceInstanceName;
                      const href =
                        externalLink || `/${sourceInstanceName}${slug}`;
                      const formattedDate =
                        date || dateStart
                          ? dateFormat.format(new Date(date || dateStart))
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
                          {externalLink ? (
                            <Anchor
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              <Text
                                size={size === 'small' ? 'xlarge' : 'xxlarge'}
                                weight="500"
                                color="#292D3A"
                              >
                                {resourceTitle}
                              </Text>
                            </Anchor>
                          ) : (
                            <Link to={href} style={{ textDecoration: 'none' }}>
                              <Text
                                size={size === 'small' ? 'xlarge' : 'xxlarge'}
                                weight="500"
                                color="#292D3A"
                              >
                                {resourceTitle}
                              </Text>
                            </Link>
                          )}
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
                  <VideoGrid>
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </VideoGrid>
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
            author: PropTypes.string,
            authorimage: PropTypes.string,
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
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: {
          sourceInstanceName: {
            in: ["blog", "event", "platform", "greenlake", "video"]
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
            dateStart
            tags
            author
            active
            externalLink
            youtubeid
            youtubelink
            authorimage
          }
        }
      }
    }
  }
`;
