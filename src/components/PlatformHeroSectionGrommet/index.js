import { Box, Image, Text } from 'grommet';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

const PlatformHeroSectionGrommet = ({
  title,
  description,
  navItems,
  activeHref: controlledActiveHref,
  onNavClick,
  onActiveHrefChange,
}) => {
  const allItems = useMemo(
    () => [
      { label: 'Getting started', href: '#platform-content' },
      ...navItems,
    ],
    [navItems],
  );

  const [internalActiveHref, setInternalActiveHref] = useState(
    allItems[0].href,
  );
  const activeHref = controlledActiveHref || internalActiveHref;

  const updateActiveHref = (href) => {
    if (onActiveHrefChange) onActiveHrefChange(href);
    if (!controlledActiveHref) setInternalActiveHref(href);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      let current = window.location.hash || allItems[0].href;
      for (const item of allItems) {
        const id = item.href.startsWith('#') ? item.href.slice(1) : null;
        if (!id || id === 'platform-content') continue;
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          current = item.href;
        }
      }
      updateActiveHref(current);
    };

    const onHashChange = () => {
      updateActiveHref(window.location.hash || allItems[0].href);
    };

    onHashChange();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [allItems, controlledActiveHref, onActiveHrefChange]);

  const handleNavClick = (event, href) => {
    if (typeof window === 'undefined') return;

    event.preventDefault();
    updateActiveHref(href);

    if (onNavClick) {
      onNavClick(event, href);
      return;
    }

    window.history.replaceState(null, '', href);

    const id = href.startsWith('#') ? href.slice(1) : '';
    if (!id) return;

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      overflow="hidden"
      direction="column"
      style={{
        position: 'relative',
        backgroundColor: '#F7F7F7',
        gap: '36px',
        fontFamily: 'HPE Graphik, Metric, sans-serif',
        padding: '96px max(160px, calc((100% - 1600px) / 2))',
      }}
    >
      {/* Background image at 30% opacity per Figma */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <img
          alt=""
          src="/images/background-hero-bar.jpg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
          }}
        />
      </div>

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
          size="28px"
          weight={400}
          color="#292D3A"
          style={{
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
        size="72px"
        weight={500}
        color="#292D3A"
        style={{
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
        <div
          style={{
            fontSize: '32px',
            fontWeight: 400,
            color: '#606A70',
            lineHeight: '43px',
            letterSpacing: '-0.2px',
            maxWidth: '1600px',
            margin: 0,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {description}
        </div>
      )}

      {/* Horizontal nav pill bar */}
      {allItems.length > 0 && (
        <Box
          overflow={{ horizontal: 'auto', vertical: 'hidden' }}
          width="100%"
          style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
        >
          <Box
            direction="row"
            align="center"
            round="large"
            pad="12px"
            width="fit-content"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
          >
            {allItems.map((item) => {
              const isActive = item.href === activeHref;
              return (
                <Box
                  key={item.href}
                  as="a"
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: isActive ? '100px' : '8px',
                    padding: '20px 36px',
                    boxSizing: 'border-box',
                    backgroundColor: isActive ? '#292D3A' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#292D3A',
                    fontSize: '20px',
                    fontWeight: isActive ? 500 : 400,
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  {item.label}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

PlatformHeroSectionGrommet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  activeHref: PropTypes.string,
  onNavClick: PropTypes.func,
  onActiveHrefChange: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ),
};

PlatformHeroSectionGrommet.defaultProps = {
  description: '',
  activeHref: '',
  onNavClick: undefined,
  onActiveHrefChange: undefined,
  navItems: [],
};

export default PlatformHeroSectionGrommet;
