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
  CardImageWrapper,
  CardImageGradient,
  CardBody,
  PrevButton,
  NextButton,
  AuthorRow,
  AuthorAvatar,
  AuthorName,
  PostDate,
} from './styles';

const dateFormat = Intl.DateTimeFormat('default', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

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
          Developer stories
        </Heading>

        <Box direction="row" gap="small">
          <PrevButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous stories"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 4L7 10L13 16" stroke="#292d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </PrevButton>

          <NextButton
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next stories"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 4L13 10L7 16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NextButton>
        </Box>
      </Box>

      {/* Carousel */}
      <CarouselViewport>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {blogs.map(({ node }) => {
            const { title, date, author, authorimage, thumbnailimage } =
              node.frontmatter;
            const slug = node.fields.slug;
            const excerpt =
              node.excerpt && node.excerpt.length > 130
                ? `${node.excerpt.slice(0, 130).trimEnd()}…`
                : node.excerpt || '';
            const coverImg = thumbnailimage || authorimage || '';
            const postDate = date
              ? dateFormat.format(new Date(date))
              : '';

            return (
              <StoryCard key={slug}>
                <CardImageWrapper>
                  {coverImg && (
                    <img
                      src={coverImg}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  )}
                  <CardImageGradient />
                </CardImageWrapper>

                <CardBody>
                  <Heading
                    level={3}
                    margin="none"
                    style={{
                      color: '#292d3a',
                      fontSize: '20px',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </Heading>

                  <Text
                    style={{
                      color: '#3e4550',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      opacity: 0.75,
                    }}
                  >
                    {excerpt}
                  </Text>

                  <Anchor
                    href={`/blog${slug}`}
                    icon={<LinkNext size="small" />}
                    label="Read more"
                    reverse
                    style={{ color: '#292d3a', fontWeight: 500 }}
                  />

                  {(author || postDate) && (
                    <AuthorRow>
                      {authorimage && (
                        <AuthorAvatar src={authorimage} alt={author || ''} />
                      )}
                      <div>
                        {author && <AuthorName>{author}</AuthorName>}
                        {postDate && <PostDate>{postDate}</PostDate>}
                      </div>
                    </AuthorRow>
                  )}
                </CardBody>
              </StoryCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>
    </Section>
  );
};

DeveloperStoriesSection.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({})),
};

export default DeveloperStoriesSection;
