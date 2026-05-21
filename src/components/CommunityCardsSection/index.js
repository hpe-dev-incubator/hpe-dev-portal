import React from 'react';
import styled from 'styled-components';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionWrapper = styled.section`
  display: flex;
  gap: 24px;
  padding: 0 24px;
  margin-top: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 16px;
    gap: 16px;
  }
`;

const CtaCard = styled.a`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 96px 72px;
  text-decoration: none;
  background-color: ${({ bgColor }) => bgColor};
  overflow: hidden;
  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.08);
    text-decoration: none;
  }

  @media (max-width: 768px) {
    padding: 64px 32px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const CardTitle = styled.h2`
  font-size: 48px;
  font-weight: 500;
  line-height: 56px;
  letter-spacing: -0.5px;
  color: #ffffff;
  text-align: center;
  margin: 0;

  strong {
    font-weight: 700;
  }

  @media (max-width: 1024px) {
    font-size: 36px;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CardDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: -0.2px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
  max-width: 480px;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 1.55;
  }
`;

const CardButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  color: #292d3a;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  padding: 20px 36px;
  border-radius: 9999px;
  min-height: 64px;
  white-space: nowrap;
  pointer-events: none;
`;

// ---------------------------------------------------------------------------
// Arrow icon
// ---------------------------------------------------------------------------
const ArrowRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 10H16M10 4l6 6-6 6"
      stroke="#292d3a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Card definitions
// ---------------------------------------------------------------------------
const CARDS = [
  {
    id: 'community',
    title: 'Join the HPE dev community on Slack',
    description:
      'Connect with developers, ask questions, and collaborate with the HPE developer community.',
    cta: 'Join on Slack',
    href: 'https://developer.hpe.com/slack-signup/',
    bgColor: '#0070f8',
    isExternal: true,
  },
  {
    id: 'contributor',
    title: 'Become a contributor',
    description:
      'Share your expertise. Write for the HPE Developer blog and reach thousands of engineers.',
    cta: 'Start contributing',
    href: '/contribute',
    bgColor: '#7764fc',
  },
  {
    id: 'newsletter',
    // Title uses JSX so /dev can be bolded per Figma design
    titleJsx: <>Sign up for the HPE Dev newsletter</>,
    description:
      "Signal over noise. Product updates, field notes, and what's actually worth your time.",
    cta: 'Get updates',
    href: 'https://developer.hpe.com/newsletter-signup/',
    bgColor: '#cc54a4',
    isExternal: true,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const CommunityCardsSection = () => (
  <SectionWrapper aria-label="Join the HPE developer community">
    {CARDS.map((card) => (
      <CtaCard
        key={card.id}
        href={card.href}
        bgColor={card.bgColor}
        target={card.isExternal ? '_blank' : undefined}
        rel={card.isExternal ? 'noreferrer noopener' : undefined}
      >
        <CardContent>
          <CardTitle>{card.titleJsx || card.title}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
          <CardButton>
            {card.cta} <ArrowRight />
          </CardButton>
        </CardContent>
      </CtaCard>
    ))}
  </SectionWrapper>
);

export default CommunityCardsSection;
