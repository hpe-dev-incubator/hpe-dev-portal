import { Box, Image, Text } from 'grommet';
import PropTypes from 'prop-types';
import React,{ useEffect, useMemo, useState } from 'react';

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

  const [internalActiveHref, setInternalActiveHref] = useState(allItems[0].href);
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
  height="560px"
  overflow="hidden"
  pad={{ top: '72px', bottom: '72px', left: '160px', right: '160px' }}
  gap="large"
  direction="column"
  style={{
    position: 'relative',
    backgroundColor: '#F7F7F7',
    backgroundImage: "url('/images/background-hero-bar.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
  }}
>
  {/* Background image layer with 30% opacity
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('/images/background-hero-bar.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
      opacity: 0.3,
      zIndex: 1,
    }}
  /> */}

      {/* Breadcrumb: Products / {Title} */}
      <Box direction="row" align="center" gap="xsmall">
        <Image
          src="/images/vector-product.png"
          width="25px"
          height="25px"
          alt=""
        />
        <Text
          size="26px"
          weight={400}
          color="#292D3A"
          style={{ letterSpacing: '-0.5px', lineHeight: '100%', fontFamily: 'HPE Graphik' }}
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
        style={{ lineHeight: '100%', margin: 0, padding: 0 }}
      >
        {title}
      </Text>

      {/* Description — first paragraph from markdown body */}
      {description && (
        <div
          style={{
            fontSize: '30px',
            fontWeight: 400,
            color: '#606A70',
            lineHeight: '43px',
            maxWidth: '1600px',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {description}
        </div>
      )}

      {/* Horizontal nav pill bar */}
      {allItems.length > 0 && (
        <Box
          height="80px"
          overflow={{ horizontal: 'auto', vertical: 'hidden' }}
          style={{ maxWidth: '1400px', flexShrink: 0, paddingTop:'-10px' }}

        >
          <Box
            direction="row"
            align="center"
            round="large"
            pad="2px"
            height="60px"
            width="fit-content"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)'}}
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
                    borderRadius: '90px',
                    padding: '5px 15px',
                    height: '50px',
                    boxSizing: 'border-box',
                    backgroundColor: isActive ? '#292D3A' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#292D3A',
                    fontSize: '18px',
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
