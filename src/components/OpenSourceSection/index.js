import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text, ResponsiveContext } from 'grommet';
import {
  CARD_WIDTH,
  CARD_GAP,
  Section,
  CarouselViewport,
  CarouselTrack,
  OsCard,
  LogoWrapper,
  PrevButton,
  NextButton,
} from './styles';

// GitHub mark SVG — shown when a project has no logo image
const GitHubMark = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 98 96"
    fill="#292d3a"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);

// External / share link icon matching the Figma design
const LinkOutIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      stroke="#292d3a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="15 3 21 3 21 9"
      stroke="#292d3a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="14"
      x2="21"
      y2="3"
      stroke="#292d3a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OpenSourceSection = ({ projects = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const size = useContext(ResponsiveContext);

  if (projects.length === 0) return null;

  const cardsVisible = size === 'small' ? 1 : size === 'medium' ? 2 : 3;
  const maxIndex = Math.max(0, projects.length - cardsVisible);
  const translateX = currentIndex * (CARD_WIDTH + CARD_GAP);

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <Section>
      {/* Header row: title + nav buttons */}
      <Box
        direction="row"
        justify="between"
        align="center"
        margin={{ bottom: 'medium' }}
      >
        <Heading
          level={2}
          margin="none"
          style={{
            color: '#292d3a',
            fontSize: '48px',
            fontWeight: 500,
            letterSpacing: '-1.04px',
            lineHeight: 1.1,
          }}
        >
          Open source
        </Heading>

        <Box direction="row" gap="small">
          <PrevButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous open source projects"
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
            aria-label="Next open source projects"
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
      </Box>

      {/* Carousel */}
      <CarouselViewport>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {projects.map(({ node }) => {
            const { title, category, image, link } = node.frontmatter;
            const isExternal = link && link.startsWith('http');
            return (
              <OsCard
                key={title}
                href={link || '#'}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
              >
                {/* Project logo */}
                <LogoWrapper>
                  {image ? (
                    <img
                      src={image}
                      alt={`${title} logo`}
                      style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <GitHubMark />
                  )}
                </LogoWrapper>

                {/* Title + category */}
                <Box gap="12px">
                  <Box direction="row" justify="between" align="center">
                    <Text
                      style={{
                        color: '#292d3a',
                        fontSize: '24px',
                        fontWeight: 500,
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                      }}
                    >
                      {title}
                    </Text>
                    <LinkOutIcon />
                  </Box>

                  {category && (
                    <Text
                      style={{
                        color: '#3e4550',
                        fontSize: '18px',
                        opacity: 0.7,
                        letterSpacing: '-0.2px',
                        lineHeight: 1.4,
                      }}
                    >
                      {category}
                    </Text>
                  )}
                </Box>
              </OsCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>
    </Section>
  );
};

OpenSourceSection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({})),
};

export default OpenSourceSection;
