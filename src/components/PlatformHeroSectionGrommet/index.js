import { Anchor, Box, Image, Text } from 'grommet';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/* outer hero container — responsive padding and gap */
const HeroContainer = styled(Box)`
  position: relative;
  background-color: #f7f7f7;
  gap: 36px;
  font-family:
    HPE Graphik,
    Metric,
    sans-serif;
  padding: 96px max(160px, calc((100% - 1600px) / 2));

  @media (max-width: 1024px) {
    padding: 48px 48px;
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: 48px 24px;
  }
`;

/* scroll wrapper — scroll on desktop, static on mobile */
const QuickLinksOuter = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
  min-width: 0;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    overflow: visible;
  }
`;

/* pill container — inline-flex row on desktop, CSS Grid on mobile */
const QuickLinksInner = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 100px;
  padding: 12px;
  width: fit-content;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-radius: 24px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    align-items: stretch;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* suppresses Grommet HPE theme focus ring; active state provides visual feedback */
const PillAnchor = styled(Anchor)`
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 1024px) {
    display: flex !important;
    align-items: center;
    justify-content: center;
    white-space: normal !important;
    word-break: break-word;
    font-size: 16px !important;
    padding: 14px 16px !important;
    flex-shrink: unset !important;
    text-align: center;
  }
`;

const isExternal = (url) => /^https?:\/\//i.test(url);

const PlatformHeroSectionGrommet = ({ title, description, quickLinks }) => {
  const visibleLinks = (quickLinks || []).slice(0, 8);
  const firstAnchor = visibleLinks.find((l) => l.url.startsWith('#'));
  const [activeUrl, setActiveUrl] = useState(firstAnchor?.url || null);
  /* prevents scroll listener from overriding click-set active during smooth scroll */
  const clickLockRef = useRef(false);
  const lastScrollYRef = useRef(0);

  /* auto-select pill whose path matches the current page on initial load */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    const pageMatch = visibleLinks.find(
      (l) =>
        !l.url.startsWith('#') && !isExternal(l.url) && l.url === currentPath,
    );
    if (pageMatch) setActiveUrl(pageMatch.url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* mirror the original scroll-based active tracking: default to first anchor,
     then update to the last section whose top has crossed 160px */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const anchorLinks = visibleLinks.filter((l) => l.url.startsWith('#'));
    if (!anchorLinks.length) return undefined;

    const update = () => {
      if (clickLockRef.current) return;
      const currentY = window.scrollY;
      const goingDown = currentY >= lastScrollYRef.current;
      lastScrollYRef.current = currentY;
      if (!goingDown) return; // scrolling back up — keep current active pill
      let matched = null;
      for (const link of anchorLinks) {
        const el = document.getElementById(link.url.slice(1));
        if (el && el.getBoundingClientRect().top <= 160) matched = link.url;
      }
      if (matched) setActiveUrl(matched);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('hashchange', update);
    };
  }, [visibleLinks]);

  const handleClick = (event, url) => {
    if (url.startsWith('#')) {
      event.preventDefault();
      /* replaceState updates the hash without a native scroll jump or hashchange */
      window.history.replaceState(null, '', url);
      /* dispatch manually so platform.js hashchange listener syncs the sidenav */
      window.dispatchEvent(new Event('hashchange'));
      const el = document.getElementById(url.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveUrl(url);
    clickLockRef.current = true;
    setTimeout(() => {
      clickLockRef.current = false;
    }, 800);
  };

  return (
    <HeroContainer overflow="hidden" direction="column">
      {/* Background image at 30% opacity per Figma */}
      <Box
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Image
          alt=""
          src="/images/background-hero-bar.jpg"
          fit="cover"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.3,
          }}
        />
      </Box>

      {/* Breadcrumb: Products / {Title} */}
      <Box
        direction="row"
        align="center"
        gap="12px"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Image
          src="/images/vector-product.png"
          width="36px"
          height="36px"
          alt=""
        />
        <Text
          weight={400}
          color="#292D3A"
          style={{
            fontSize: 'clamp(16px, 3vw, 28px)',
            letterSpacing: '-0.5px',
            lineHeight: '100%',
          }}
        >
          Products / {title}
        </Text>
      </Box>

      {/* H1 title */}
      <Text
        as="h1"
        weight={500}
        color="#292D3A"
        style={{
          fontSize: 'clamp(36px, 8vw, 72px)',
          lineHeight: 'normal',
          letterSpacing: '-1.04px',
          margin: 0,
          padding: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </Text>

      {/* Description — first paragraph from markdown body */}
      {description && (
        <Box
          style={{
            fontSize: 'clamp(18px, 3.5vw, 32px)',
            fontWeight: 400,
            color: '#606A70',
            lineHeight: '1.35',
            letterSpacing: '-0.2px',
            maxWidth: '1600px',
            margin: 0,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {description}
        </Box>
      )}

      {/* Quick links pill bar — driven by frontmatter, max 8 */}
      {visibleLinks.length > 0 && (
        <QuickLinksOuter>
          <QuickLinksInner>
            {visibleLinks.map((link) => {
              const active = activeUrl === link.url;
              return (
                <PillAnchor
                  key={link.url}
                  href={link.url}
                  onClick={(event) => handleClick(event, link.url)}
                  target={isExternal(link.url) ? '_blank' : undefined}
                  rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: active ? '100px' : '8px',
                    padding: '20px 36px',
                    boxSizing: 'border-box',
                    backgroundColor: active ? '#292D3A' : 'transparent',
                    color: active ? '#FFFFFF' : '#292D3A',
                    fontSize: '20px',
                    fontWeight: active ? 500 : 400,
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    fontFamily: 'inherit',
                    minHeight: '100%',
                  }}
                >
                  {link.label}
                </PillAnchor>
              );
            })}
          </QuickLinksInner>
        </QuickLinksOuter>
      )}
    </HeroContainer>
  );
};

PlatformHeroSectionGrommet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  quickLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
};

PlatformHeroSectionGrommet.defaultProps = {
  description: '',
  quickLinks: [],
};

export default PlatformHeroSectionGrommet;
