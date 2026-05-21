import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text, Anchor, ResponsiveContext } from 'grommet';
import { LinkNext } from 'grommet-icons';
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
  CardBody,
  PrevButton,
  NextButton,
} from './styles';

const DEFAULT_THUMBNAILS = [
  '/img/dev-stories/thumb-1.png',
  '/img/dev-stories/thumb-2.png',
  '/img/dev-stories/thumb-3.png',
];

const DeveloperStoriesSection = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const size = useContext(ResponsiveContext);

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
            const { title, thumbnailimage } =
              node.frontmatter;
            const slug = node.fields.slug;
            const excerpt =
              node.excerpt && node.excerpt.length > 130
                ? `${node.excerpt.slice(0, 130).trimEnd()}…`
                : node.excerpt || '';
            const coverImg =
              thumbnailimage ||
              DEFAULT_THUMBNAILS[index % DEFAULT_THUMBNAILS.length];

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
                    icon={<LinkNext size="small" />}
                    label="Read more"
                    reverse
                    style={{ color: '#292d3a', fontWeight: 500, fontSize: '20px' }}
                  />
                </CardBody>
              </StoryCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>

      {/* Carousel controls — below the carousel, left-aligned per Figma */}
      <Box direction="row" gap="small" margin={{ top: 'medium' }}>
        <PrevButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Previous stories"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13 4L7 10L13 16"
              stroke="#292d3a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </PrevButton>

        <NextButton
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          aria-label="Next stories"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 4L13 10L7 16"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </NextButton>
      </Box>
    </Section>
  );
};

DeveloperStoriesSection.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({})),
};

export default DeveloperStoriesSection;
