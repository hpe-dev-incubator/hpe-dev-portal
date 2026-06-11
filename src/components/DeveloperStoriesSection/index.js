import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Heading, Text, Anchor, ResponsiveContext } from 'grommet';
import { LinkNext } from 'grommet-icons';
import CarouselNavButtons from '../CarouselNavButtons';
import {
  CARD_WIDTH,
  CARD_GAP,
  Section,
  CarouselViewport,
  CarouselTrack,
  StoryCard,
  CardBgLayers,
  CardGradient,
  CardImageSpacer,
  CardBadge,
  CardBody,
} from './styles';

const DEVELOPER_THUMBNAILS = [
  '/img/dev-stories/dev-story-0.jpg',
  '/img/dev-stories/dev-story-1.jpg',
  '/img/dev-stories/dev-story-2.jpg',
  '/img/dev-stories/dev-story-3.jpg',
  '/img/dev-stories/dev-story-4.jpg',
  '/img/dev-stories/dev-story-5.jpg',
  '/img/dev-stories/dev-story-6.jpg',
  '/img/dev-stories/dev-story-7.jpg',
  '/img/dev-stories/dev-story-8.jpg',
  '/img/dev-stories/opsramp-terraform.jpg',
  '/img/dev-stories/opsramp-dashboard.jpg',
];

const getThumbnail = () =>
  DEVELOPER_THUMBNAILS[Math.floor(Math.random() * DEVELOPER_THUMBNAILS.length)];

const shuffleThumbnails = () =>
  [...DEVELOPER_THUMBNAILS].sort(() => Math.random() - 0.5);

const DeveloperStoriesSection = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const size = useContext(ResponsiveContext);
  const shuffledThumbnails = useMemo(shuffleThumbnails, []);

  if (blogs.length === 0) return null;

  const cardsVisible = size === 'small' ? 1 : size === 'medium' ? 2 : 3;
  const maxIndex = Math.max(0, blogs.length - cardsVisible);
  const translateX = currentIndex * (CARD_WIDTH + CARD_GAP);

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <Section>
      {/* Section header */}
      <Heading
        level={2}
        margin={{ bottom: 'large' }}
        style={{
          color: '#292d3a',
          fontSize: '48px',
          fontWeight: 500,
          letterSpacing: '-1.04px',
          lineHeight: 1.1,
        }}
      >
        Developer stories
      </Heading>

      {/* Carousel */}
      <CarouselViewport>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {blogs.map(({ node }, index) => {
            const { title, thumbnailimage } = node.frontmatter;
            const slug = node.fields.slug;
            const excerpt =
              node.excerpt && node.excerpt.length > 130
                ? `${node.excerpt.slice(0, 130).trimEnd()}…`
                : node.excerpt || '';
            const coverImg =
              thumbnailimage ||
              shuffledThumbnails[index % shuffledThumbnails.length];

            return (
              <StoryCard key={slug}>
                {/* Absolute background: image + gradient overlay */}
                <CardBgLayers aria-hidden="true">
                  {coverImg && (
                    <img
                      src={coverImg}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  )}
                  <CardGradient />
                </CardBgLayers>

                {/* Spacer creates the visible image zone above the text */}
                <CardImageSpacer />

                <CardBody>
                  <CardBadge>Blog</CardBadge>
                  <Heading
                    level={3}
                    margin="none"
                    style={{
                      color: '#292d3a',
                      fontSize: '32px',
                      fontWeight: 500,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </Heading>

                  <Text
                    style={{
                      color: '#3e4550',
                      fontSize: '18px',
                      lineHeight: 1.5,
                      opacity: 0.7,
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {excerpt}
                  </Text>

                  <Anchor
                    href={`/blog${slug}`}
                    icon={<LinkNext size="small" color="brand" />}
                    label="Learn more"
                    reverse
                    style={{
                      color: '#292d3a',
                      fontWeight: 500,
                      fontSize: '20px',
                    }}
                  />
                </CardBody>
              </StoryCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>

      <CarouselNavButtons
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={currentIndex === 0}
        disableNext={currentIndex >= maxIndex}
        ariaLabelPrev="Previous stories"
        ariaLabelNext="Next stories"
      />
    </Section>
  );
};

DeveloperStoriesSection.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({})),
};

export default DeveloperStoriesSection;
