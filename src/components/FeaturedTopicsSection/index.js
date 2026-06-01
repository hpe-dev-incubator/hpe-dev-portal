import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Box, Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import { ButtonLink } from '../Link';
import { SectionWrapper, FeatureCard, CardBgImage, CardTitle } from './styles';

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
          role="link"
          tabIndex={0}
          bgColor={card.bgColor}
          overlay={card.overlay}
          onClick={() => {
            if (card.href?.startsWith('http')) {
              window.open(card.href, '_blank', 'noopener,noreferrer');
              return;
            }
            navigate(card.href || '/');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              if (card.href?.startsWith('http')) {
                window.open(card.href, '_blank', 'noopener,noreferrer');
                return;
              }
              navigate(card.href || '/');
            }
          }}
        >
          {card.bgImage && <CardBgImage src={card.bgImage} alt="" />}

          <Text
            size="28px"
            weight={500}
            color="white"
            margin="none"
            style={{
              lineHeight: '38px',
              letterSpacing: '-0.28px',
              opacity: 0.9,
              zIndex: 1,
            }}
          >
            {card.eyebrow}
          </Text>

          <Box direction="column" gap="32px" width="100%" style={{ zIndex: 1 }}>
            {card.icon && (
              <Box
                as="img"
                src={card.icon}
                alt=""
                width="64px"
                height="64px"
                round="16px"
                flex={false}
              />
            )}

            <CardTitle>{card.title}</CardTitle>

            <Text
              size="20px"
              color="white"
              margin="none"
              style={{
                lineHeight: '30px',
                letterSpacing: '-0.2px',
                opacity: 0.8,
                maxWidth: '100%',
              }}
            >
              {card.description}
            </Text>

            <Box
              style={{
                minHeight: '64px',
                alignSelf: 'flex-start',
                width: 'fit-content',
              }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <ButtonLink
                to={card.href || '/'}
                target={card.href?.startsWith('http') ? '_blank' : undefined}
                rel={
                  card.href?.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                label={
                  <Text
                    as="span"
                    size="20px"
                    weight={500}
                    color="#292d3a"
                    margin="none"
                    style={{ lineHeight: '24px', whiteSpace: 'nowrap' }}
                  >
                    {card.cta}
                  </Text>
                }
                icon={<LinkNext color="#292d3a" size="24px" />}
                reverse
                plain={false}
                background={{ color: 'white' }}
                round="full"
                pad={{ horizontal: '36px', vertical: '20px' }}
                gap="12px"
                style={{
                  borderRadius:
                    'var(--button-primary-medium-borderRadius, 9999px)',
                  background: 'var(--button-primary-rest-background, #FFF)',
                  opacity: 1,
                }}
              />
            </Box>
          </Box>
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
