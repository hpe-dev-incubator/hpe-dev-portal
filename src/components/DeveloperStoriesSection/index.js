import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Anchor, Box, Heading, Text, ResponsiveContext } from 'grommet';
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
  BucketBadge,
} from './styles';

const API_BASE = process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT;

// Returns true when a workshop's category field (array or string) matches target.
const matchesCategory = (workshop, category) => {
  if (!workshop.category) return false;
  const cats = Array.isArray(workshop.category)
    ? workshop.category
    : [workshop.category];
  return cats.some((c) => c.toLowerCase() === category.toLowerCase());
};

// Select up to 6 workshops representing different buckets:
//   Latest (1) → Popular (1) → one per API category → backfill from rest.
const pickWorkshops = (workshops, categories) => {
  const seen = new Set();
  const result = [];

  const add = (workshop, bucket) => {
    if (!workshop || seen.has(workshop.id)) return;
    seen.add(workshop.id);
    result.push({ ...workshop, _bucket: bucket });
  };

  // 1. Most recently updated
  const byDate = [...workshops].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  add(byDate[0], 'Latest');

  // 2. Popular
  add(
    workshops.find((w) => w.popular && !seen.has(w.id)),
    'Popular',
  );

  // 3. One representative per category returned by the API
  for (const cat of categories) {
    if (result.length >= 6) break;
    const match = workshops.find(
      (w) => !seen.has(w.id) && matchesCategory(w, cat),
    );
    if (match) {
      add(match, cat.charAt(0).toUpperCase() + cat.slice(1));
    }
  }

  // 4. Fill remaining slots chronologically
  for (const w of byDate) {
    if (result.length >= 6) break;
    if (!seen.has(w.id)) add(w, '');
  }

  return result.slice(0, 6);
};

const DeveloperStoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }

    const workshopsReq = axios.get(`${API_BASE}/api/workshops?active=true`);
    const categoriesReq = axios
      .get(`${API_BASE}/api/workshops/categories`)
      .catch(() => ({ data: [] })); // categories are non-fatal

    Promise.all([workshopsReq, categoriesReq])
      .then(([workshopsRes, categoriesRes]) => {
        const wods = (workshopsRes.data || []).filter(
          (w) => w.sessionType === 'Workshops-on-Demand',
        );
        const cats = categoriesRes.data || [];
        setStories(pickWorkshops(wods, cats));
      })
      .catch((err) => {
        console.error('DeveloperStoriesSection: failed to load workshops', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // How many full cards are visible based on Grommet breakpoints
  const cardsVisible = size === 'small' ? 1 : size === 'medium' ? 2 : 3;
  const maxIndex = Math.max(0, stories.length - cardsVisible);
  const translateX = currentIndex * (CARD_WIDTH + CARD_GAP);

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  // Hide the section while loading or when no data is available
  if (loading || stories.length === 0) return null;

  return (
    <Section>
      {/* Section header: title left, carousel nav right */}
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
      </Box>

      {/* Carousel */}
      <CarouselViewport>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {stories.map((workshop) => {
            const desc =
              workshop.description && workshop.description.length > 130
                ? `${workshop.description.slice(0, 130).trimEnd()}…`
                : workshop.description || '';
            const link = workshop.replayLink || '/hackshack/workshops';

            return (
              <StoryCard key={workshop.id}>
                <CardImageWrapper>
                  {workshop.workshopImg && (
                    <img
                      src={workshop.workshopImg}
                      alt={workshop.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center bottom',
                        display: 'block',
                      }}
                    />
                  )}
                  <CardImageGradient />
                </CardImageWrapper>

                <CardBody>
                  {workshop._bucket && (
                    <BucketBadge>{workshop._bucket}</BucketBadge>
                  )}

                  <Heading
                    level={3}
                    margin="none"
                    style={{
                      color: '#292d3a',
                      fontSize: '24px',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {workshop.name}
                  </Heading>

                  <Text
                    style={{
                      color: '#3e4550',
                      fontSize: '16px',
                      lineHeight: 1.6,
                      opacity: 0.75,
                    }}
                  >
                    {desc}
                  </Text>

                  <Anchor
                    href={link}
                    target={workshop.replayLink ? '_blank' : undefined}
                    rel={
                      workshop.replayLink ? 'noreferrer noopener' : undefined
                    }
                    icon={<LinkNext size="small" />}
                    label="Learn more"
                    reverse
                    style={{ color: '#292d3a', fontWeight: 500 }}
                  />
                </CardBody>
              </StoryCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>
    </Section>
  );
};

export default DeveloperStoriesSection;
