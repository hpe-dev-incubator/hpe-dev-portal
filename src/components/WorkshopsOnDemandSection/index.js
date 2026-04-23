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

// Select exactly 6 workshops:
//   2 Latest → 2 Popular → 1 Open Source → 1 HPE GreenLake
const pickWorkshops = (workshops) => {
  const seen = new Set();
  const result = [];

  const add = (workshop, bucket) => {
    if (!workshop || seen.has(workshop.id)) return false;
    seen.add(workshop.id);
    result.push({ ...workshop, _bucket: bucket });
    return true;
  };

  const byDate = [...workshops].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  const popular = workshops.filter((w) => w.popular);

  // 1 & 2. Two most recently updated
  for (const w of byDate) {
    if (result.length >= 2) break;
    add(w, 'Latest');
  }

  // 3 & 4. Two popular
  for (const w of popular) {
    if (result.length >= 4) break;
    add(w, 'Popular');
  }
  // fill with latest if not enough popular
  for (const w of byDate) {
    if (result.length >= 4) break;
    add(w, 'Popular');
  }

  // 5. One Open Source
  const openSource = workshops.find(
    (w) => !seen.has(w.id) && matchesCategory(w, 'open source'),
  );
  if (!add(openSource, 'Open Source')) {
    const fallback = byDate.find((w) => !seen.has(w.id));
    add(fallback, '');
  }

  // 6. One HPE GreenLake
  const greenlake = workshops.find(
    (w) =>
      !seen.has(w.id) &&
      (matchesCategory(w, 'hpe greenlake') ||
        matchesCategory(w, 'greenlake') ||
        matchesCategory(w, 'hpe-greenlake')),
  );
  if (!add(greenlake, 'HPE GreenLake')) {
    const fallback = byDate.find((w) => !seen.has(w.id));
    add(fallback, '');
  }

  return result.slice(0, 6);
};

const WorkshopsOnDemandSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/api/workshops?active=true`)
      .then((res) => {
        const wods = (res.data || []).filter(
          (w) => w.sessionType === 'Workshops-on-Demand',
        );
        setStories(pickWorkshops(wods));
      })
      .catch((err) => {
        console.error('WorkshopsOnDemandSection: failed to load workshops', err);
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
          Workshops on Demand
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
            const link = workshop.replayId
              ? `/hackshack/workshop/${workshop.replayId}`
              : '/hackshack/workshops';

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
                    target="_blank"
                    rel="noreferrer noopener"
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

export default WorkshopsOnDemandSection;
