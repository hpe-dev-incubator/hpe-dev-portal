import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContext } from 'grommet';
import CarouselNavButtons from '../CarouselNavButtons';

import {
  CARD_WIDTH,
  CARD_GAP,
  Section,
  SectionHeader,
  SectionTitle,
  ViewAllLink,
  CarouselViewport,
  CarouselTrack,
  EventCard,
  EventImageWrapper,
  EventBody,
  EventCategory,
  EventTitle,
  EventLink,
} from './styles';

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 8H13M8 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ComingEventsSection = ({ events = [] }) => {
  const [index, setIndex] = useState(0);
  const size = useContext(ResponsiveContext);
  const viewportRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH);

  const cardsVisible = size === 'small' ? 1 : size === 'medium' ? 2 : 3;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      const available = el.offsetWidth;
      if (available > 0) {
        const computed = Math.floor(
          (available - (cardsVisible - 1) * CARD_GAP) / cardsVisible,
        );
        setCardWidth(Math.min(computed, CARD_WIDTH));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardsVisible]);

  const now = new Date();

  // Sort: upcoming first (ascending), then recent past (descending)
  const upcoming = events
    .filter((e) => new Date(e.node.frontmatter.dateStart) >= now)
    .sort(
      (a, b) =>
        new Date(a.node.frontmatter.dateStart) -
        new Date(b.node.frontmatter.dateStart),
    );

  const past = events
    .filter((e) => new Date(e.node.frontmatter.dateStart) < now)
    .sort(
      (a, b) =>
        new Date(b.node.frontmatter.dateStart) -
        new Date(a.node.frontmatter.dateStart),
    );

  const MAX_CARDS = 8;
  const pastToShow = past.slice(0, Math.max(0, MAX_CARDS - upcoming.length));
  const items = [...upcoming, ...pastToShow].slice(0, MAX_CARDS);

  const maxIndex = Math.max(0, items.length - cardsVisible);
  const translateX = index * (cardWidth + CARD_GAP);

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Events</SectionTitle>
      </SectionHeader>

      <CarouselViewport ref={viewportRef}>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {items.map(({ node }) => {
            const { title, dateStart, category, image, link } =
              node.frontmatter;
            const excerpt = node.excerpt || '';
            const isUpcoming = new Date(dateStart) >= now;
            const href = link || `/event${node.fields.slug}`;
            const isExternal = !!(link && link.startsWith('http'));

            return (
              <EventCard
                key={node.fields.slug}
                $width={cardWidth}
                onClick={() =>
                  isExternal
                    ? window.open(href, '_blank', 'noreferrer')
                    : (window.location.href = href)
                }
              >
                <EventImageWrapper>
                  {image && <img src={image} alt={title} />}
                </EventImageWrapper>

                <EventBody>
                  {/* Text block: category + title + description (gap: 12px) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {category && <EventCategory>{category}</EventCategory>}

                    <EventTitle>{title}</EventTitle>

                    {excerpt && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: '24px',
                          color: '#3e4550',
                        }}
                      >
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* Register / Watch recording link */}
                  <EventLink
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer noopener' : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isUpcoming ? 'Register now' : 'Watch recording'}{' '}
                    <ArrowRight />
                  </EventLink>
                </EventBody>
              </EventCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>

      <CarouselNavButtons
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={index === 0}
        disableNext={index >= maxIndex}
        ariaLabelPrev="Previous"
        ariaLabelNext="Next"
      />
    </Section>
  );
};

ComingEventsSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        fields: PropTypes.shape({ slug: PropTypes.string }),
        frontmatter: PropTypes.shape({
          title: PropTypes.string.isRequired,
          dateStart: PropTypes.string.isRequired,
          dateEnd: PropTypes.string,
          category: PropTypes.string,
          image: PropTypes.string,
          link: PropTypes.string,
        }),
      }),
    }),
  ),
};

export default ComingEventsSection;
