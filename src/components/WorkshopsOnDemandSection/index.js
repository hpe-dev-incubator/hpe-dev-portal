import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Anchor, Heading, Text, ResponsiveContext } from 'grommet';
import { LinkNext } from 'grommet-icons';
import CarouselNavButtons from '../CarouselNavButtons';
import {
  CARD_WIDTH,
  CARD_GAP,
  Section,
  CarouselViewport,
  CarouselTrack,
  StoryCard,
  CardImageWrapper,
  CardBody,
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
        const selectedWorkshops = pickWorkshops(wods);
        setStories(selectedWorkshops);
      })
      .catch((err) => {
        console.error(
          'WorkshopsOnDemandSection: failed to load workshops',
          err,
        );
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
      {/* Section header: title only */}
      <Heading
        level={2}
        margin={{ bottom: 'large' }}
        style={{
          color: '#3e4550',
          fontSize: '48px',
          fontWeight: 500,
          letterSpacing: '-1.04px',
          lineHeight: 1.1,
        }}
      >
        Workshops-on-Demand
      </Heading>

      {/* Carousel */}
      <CarouselViewport>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {stories.map((workshop, index) => {
            const desc =
              workshop.description && workshop.description.length > 130
                ? `${workshop.description.slice(0, 130).trimEnd()}…`
                : workshop.description || '';
            const registerLink = `/hackshack/workshops?id=${workshop.id}`;
            const replayLink = workshop.replayId
              ? `/hackshack/workshop/${workshop.replayId}`
              : '/hackshack/workshops';
            const isFull = workshop.location === 'FULL';

            return (
              <StoryCard key={workshop.id}>
                <CardImageWrapper>
                  <img
                    src={
                      workshop.workshopImg ||
                      DEFAULT_THUMBNAILS[index % DEFAULT_THUMBNAILS.length]
                    }
                    alt={workshop.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      display: 'block',
                    }}
                  />
                </CardImageWrapper>

                <CardBody>
                  {/* Text block: heading + author + description */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <Heading
                      level={3}
                      margin="none"
                      style={{
                        color: '#292d3a',
                        fontSize: '28px',
                        fontWeight: 500,
                        letterSpacing: '-0.28px',
                        lineHeight: '34px',
                      }}
                    >
                      {workshop.name}
                    </Heading>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {workshop.presenter && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {workshop.avatar ? (
                            <img
                              src={workshop.avatar}
                              alt=""
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: '#d5d5d5',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Text
                            style={{
                              fontSize: '16px',
                              color: '#3e4550',
                              lineHeight: '24px',
                            }}
                          >
                            by {workshop.presenter}
                          </Text>
                        </div>
                      )}

                      <Text
                        style={{
                          color: '#3e4550',
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        {desc}
                      </Text>
                    </div>
                  </div>

                  {/* Button group */}
                  {isFull ? (
                    <Text
                      style={{
                        fontSize: '16px',
                        color: '#9aa5ab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Currently full, please try again later
                    </Text>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Anchor
                        href={registerLink}
                        icon={<LinkNext size="small" />}
                        label="Register"
                        reverse
                        color="brand"
                        style={{ fontWeight: 500, fontSize: '16px' }}
                      />
                      <Anchor
                        href={replayLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        label={
                          workshop.replayLink ? 'Watch replay' : 'Learn more'
                        }
                        style={{
                          color: '#292d3a',
                          fontWeight: 500,
                          fontSize: '16px',
                        }}
                      />
                    </div>
                  )}
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
        ariaLabelPrev="Previous workshops"
        ariaLabelNext="Next workshops"
      />
    </Section>
  );
};

export default WorkshopsOnDemandSection;
