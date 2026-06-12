import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { ResponsiveContext } from 'grommet';

import CarouselNavButtons from '../CarouselNavButtons';

import {
  CARD_WIDTH,
  CARD_GAP,
  Section,
  SectionHeader,
  SectionTitle,
  CarouselViewport,
  CarouselTrack,
  NewCard,
  CardImage,
  CardBody,
  TypeBadge,
  CardTitle,
  CardDescription,
  CardLink,
  Controls,
} from './styles';

const API_BASE = process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT;
const MAX_WORKSHOPS = 2;

const ArrowRight = ({ color = '#292d3a' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 9H15M9 3l6 6-6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const buildItems = (platformEdges, workshops, newsletterEdges, eventEdges) => {
  const platformItems = platformEdges.map(({ node }) => ({
    id: `platform-${node.fields.slug}`,
    type: 'Platform',
    title: node.frontmatter.title,
    description: node.frontmatter.description || '',
    image: node.frontmatter.image || '',
    date: node.frontmatter.date || '2000-01-01',
    link: `/platform${node.fields.slug}`,
    external: false,
  }));

  const workshopItems = workshops.slice(0, MAX_WORKSHOPS).map((w) => ({
    id: `workshop-${w.id}`,
    type: 'Workshop',
    title: w.name,
    description:
      w.description && w.description.length > 120
        ? `${w.description.slice(0, 120).trimEnd()}…`
        : w.description || '',
    image: w.workshopImg || '',
    date: w.updatedAt || w.createdAt || '2000-01-01',
    link: w.replayId
      ? `/hackshack/workshop/${w.replayId}`
      : '/hackshack/workshops',
    external: true,
  }));

  const newsletterItems = newsletterEdges.slice(0, 1).map(({ node }) => {
    const desc = node.frontmatter.description || '';
    return {
      id: `newsletter-${node.frontmatter.link}`,
      type: 'Newsletter',
      title: node.frontmatter.title,
      description:
        desc.length > 120 ? `${desc.slice(0, 120).trimEnd()}…` : desc,
      image: '/img/newsletter/Newsletter.jpg',
      date: node.frontmatter.date || '2000-01-01',
      link: node.frontmatter.link,
      external: false,
    };
  });

  const eventItems = eventEdges.slice(0, 1).map(({ node }) => ({
    id: `event-${node.fields.slug}`,
    type: 'Event',
    title: node.frontmatter.title,
    description: node.excerpt || '',
    image: node.frontmatter.image || '',
    date: node.frontmatter.dateStart || '2000-01-01',
    link: `/event${node.fields.slug}`,
    external: false,
  }));

  return [
    ...platformItems,
    ...newsletterItems,
    ...eventItems,
    ...workshopItems,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
};

// eslint-disable-next-line react/prop-types
const WhatsNewSection = ({ platforms = [], newsletters = [], events = [] }) => {
  const [workshops, setWorkshops] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
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

  useEffect(() => {
    if (!API_BASE) return;
    axios
      .get(`${API_BASE}/api/workshops?active=true`)
      .then((res) => {
        const wods = (res.data || [])
          .filter((w) => w.sessionType === 'Workshops-on-Demand')
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, MAX_WORKSHOPS);
        setWorkshops(wods);
      })
      .catch(() => {});
  }, []);

  const items = buildItems(platforms, workshops, newsletters, events);

  const maxIndex = Math.max(0, items.length - cardsVisible);
  const translateX = index * (cardWidth + CARD_GAP);

  // Reset index if items change
  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  const handlePrev = () => {
    clearTimeout(timerRef.current);
    setIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    clearTimeout(timerRef.current);
    setIndex((i) => Math.min(maxIndex, i + 1));
  };

  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>What&#39;s new</SectionTitle>
      </SectionHeader>

      <CarouselViewport ref={viewportRef}>
        <CarouselTrack style={{ transform: `translateX(-${translateX}px)` }}>
          {items.map((item) => (
            <NewCard key={item.id} $width={cardWidth}>
              <CardImage>
                {item.image && <img src={item.image} alt={item.title} />}
              </CardImage>

              <CardBody>
                <TypeBadge type={item.type}>{item.type}</TypeBadge>

                <CardTitle className="card-title">{item.title}</CardTitle>

                <CardDescription>{item.description}</CardDescription>

                <CardLink
                  href={item.link}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer noopener' : undefined}
                >
                  Learn more
                  <ArrowRight color="#01a982" />
                </CardLink>
              </CardBody>
            </NewCard>
          ))}
        </CarouselTrack>
      </CarouselViewport>

      <Controls>
        <CarouselNavButtons
          onPrev={handlePrev}
          onNext={handleNext}
          disablePrev={index === 0}
          disableNext={index >= maxIndex}
          ariaLabelPrev="Previous"
          ariaLabelNext="Next"
        />
      </Controls>
    </Section>
  );
};

export default WhatsNewSection;
