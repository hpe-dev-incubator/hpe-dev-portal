import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContext } from 'grommet';

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
  EventDate,
  EventCategory,
  EventTitle,
  EventLink,
  Controls,
  NavBtnRow,
  NavBtn,
  SlideCounter,
} from './styles';

const monthDay = Intl.DateTimeFormat('default', {
  month: 'long',
  day: 'numeric',
});
const dayFmt = Intl.DateTimeFormat('default', { day: 'numeric' });
const yearFmt = Intl.DateTimeFormat('default', { year: 'numeric' });

const formatEventDate = (dateStart, dateEnd) => {
  const start = new Date(dateStart);
  const end = dateEnd ? new Date(dateEnd) : null;
  let str = monthDay.format(start);
  if (end && dayFmt.format(end) !== dayFmt.format(start)) {
    str += `–${dayFmt.format(end)}`;
  }
  str += `, ${yearFmt.format(end || start)}`;
  return str;
};

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

const ChevronLeft = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M14 5L8 11L14 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 5L14 11L8 17"
      stroke="currentColor"
      strokeWidth="2"
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

  const items = [...upcoming, ...past];

  const maxIndex = Math.max(0, items.length - cardsVisible);
  const translateX = index * (cardWidth + CARD_GAP);

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Upcoming events</SectionTitle>
        <ViewAllLink href="/events">
          View all <ArrowRight />
        </ViewAllLink>
      </SectionHeader>

      <CarouselViewport ref={viewportRef}>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {items.map(({ node }) => {
            const { title, dateStart, dateEnd, category, image, link } =
              node.frontmatter;
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
                  <EventDate>{formatEventDate(dateStart, dateEnd)}</EventDate>

                  {category && <EventCategory>{category}</EventCategory>}

                  <EventTitle>{title}</EventTitle>

                  <EventLink
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer noopener' : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isUpcoming ? 'Register' : 'Watch recording'} <ArrowRight />
                  </EventLink>
                </EventBody>
              </EventCard>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>

      <Controls>
        <NavBtnRow>
          <NavBtn
            onClick={handlePrev}
            disabled={index === 0}
            isPrimary={false}
            aria-label="Previous"
          >
            <ChevronLeft />
          </NavBtn>
          <NavBtn
            onClick={handleNext}
            disabled={index >= maxIndex}
            isPrimary
            aria-label="Next"
          >
            <ChevronRight />
          </NavBtn>
        </NavBtnRow>
        <SlideCounter>
          {Math.min(index + cardsVisible, items.length)} / {items.length}
        </SlideCounter>
      </Controls>
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
