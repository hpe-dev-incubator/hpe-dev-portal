import React from 'react';
import PropTypes from 'prop-types';
import {
  SectionWrapper,
  FeatureCard,
  CardBgImage,
  CardIcon,
  CardEyebrow,
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

const FeaturedTopicsSection = ({ cards }) => {
  const items = (cards || []).map(({ node }) => ({
    id: node.id,
    eyebrow: node.frontmatter.eyebrow || '',
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    cta: node.frontmatter.cta,
    href: node.frontmatter.href,
    icon: node.frontmatter.icon || '',
    bgImage: node.frontmatter.bgImage || '',
    bgColor: node.frontmatter.bgColor || '#0a1628',
    overlay: node.frontmatter.overlay || '',
    isDark: node.frontmatter.isDark !== false,
  }));

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
          {card.eyebrow && <CardEyebrow>{card.eyebrow}</CardEyebrow>}
          <CardContent>
            {card.icon && <CardIcon src={card.icon} alt="" />}
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            <CardCTA>
              {card.cta} <ArrowRight color="#292d3a" />
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
          eyebrow: PropTypes.string,
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
