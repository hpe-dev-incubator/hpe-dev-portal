import React from 'react';
import PropTypes from 'prop-types';
import {
  SectionWrapper,
  FeatureCard,
  CardBgImage,
  CardIcon,
  CardContent,
  CardTitle,
  CardDescription,
  CardCTA,
} from './styles';

const ArrowRight = ({ color = '#ffffff' }) => (
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

ArrowRight.propTypes = { color: PropTypes.string };

// ---------------------------------------------------------------------------
// Default card data — used as fallback when no CMS cards are provided.
// ---------------------------------------------------------------------------
const DEFAULT_CARDS = [
  {
    id: 1,
    title: 'Connect all your clouds to GreenLake',
    description:
      'Unify hybrid environments under one control plane, with visibility, governance, and performance built in.',
    cta: 'See how',
    href: '/topic/ai-and-data',
    icon: '/img/platforms/Greenlake.svg',
    bgImage: '',
    bgColor: '#1473e6',
    overlay:
      'linear-gradient(135deg, rgba(10,50,140,0.85) 0%, rgba(20,115,230,0.7) 60%, rgba(80,160,255,0.5) 100%)',
    isDark: true,
  },
  {
    id: 2,
    title: 'Networking for Developers',
    description:
      'Code the network. Automate everything. Ship resilient, AI-driven infrastructure that scales without the drama.',
    cta: "Let's build",
    href: '/topic/networking',
    icon: '',
    bgImage: '',
    bgColor: '#151e2b',
    overlay:
      'linear-gradient(135deg, rgba(21,30,43,0.95) 0%, rgba(40,55,75,0.9) 100%)',
    isDark: true,
  },
];

const FeaturedTopicsSection = ({ cards }) => {
  const items =
    cards && cards.length > 0
      ? cards.map(({ node }) => ({
          id: node.id,
          title: node.frontmatter.title,
          description: node.frontmatter.description,
          cta: node.frontmatter.cta,
          href: node.frontmatter.href,
          icon: node.frontmatter.icon || '',
          bgImage: node.frontmatter.bgImage || '',
          bgColor: node.frontmatter.bgColor || '#151e2b',
          overlay: node.frontmatter.overlay || '',
          isDark: node.frontmatter.isDark !== false,
        }))
      : DEFAULT_CARDS;

  return (
    <SectionWrapper aria-label="Featured topics">
      {items.map((card) => (
        <FeatureCard
          key={card.id}
          href={card.href}
          bgColor={card.bgColor}
          overlay={card.overlay}
        >
          {card.bgImage && <CardBgImage src={card.bgImage} alt="" />}
          <CardContent>
            {card.icon && <CardIcon src={card.icon} alt="" />}
            <CardTitle isDark={card.isDark}>{card.title}</CardTitle>
            <CardDescription isDark={card.isDark}>
              {card.description}
            </CardDescription>
            <CardCTA>
              {card.cta} <ArrowRight />
            </CardCTA>
          </CardContent>
        </FeatureCard>
      ))}
    </SectionWrapper>
  );
};

FeaturedTopicsSection.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string,
        frontmatter: PropTypes.shape({
          title: PropTypes.string,
          description: PropTypes.string,
          cta: PropTypes.string,
          href: PropTypes.string,
          icon: PropTypes.string,
          bgImage: PropTypes.string,
          bgColor: PropTypes.string,
          overlay: PropTypes.string,
          isDark: PropTypes.bool,
        }),
      }),
    }),
  ),
};

FeaturedTopicsSection.defaultProps = {
  cards: null,
};

export default FeaturedTopicsSection;
