import PropTypes from 'prop-types';
import React,{ useEffect, useState } from 'react';

const PlatformHeroSection = ({ title, description, navItems }) => {
  // First item is always "Getting started" pointing to the content area
  const allItems = [
    { label: 'Getting started', href: '#platform-content' },
    ...navItems,
  ];

  const [activeHref, setActiveHref] = useState(allItems[0].href);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      let current = allItems[0].href;
      for (const item of allItems) {
        const id = item.href.startsWith('#') ? item.href.slice(1) : null;
        if (!id || id === 'platform-content') continue;
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          current = item.href;
        }
      }
      setActiveHref(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        overflow: 'hidden',
        backgroundImage: "url('/images/background-hero-bar.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundColor: '#F7F7F7',
        paddingTop: '72px',
        paddingBottom: '72px',
        paddingLeft: '160px',
        paddingRight: '160px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
        opacity: '95%'
      }}
    >
      {/* Breadcrumb: Products / {Title} */}
      <div
        style={{
          fontSize: '26px',
          fontFamily: 'heading/font',
          fontWeight: 400,
          color: '#292D3A',
          letterSpacing: '-0.5px',
          lineHeight: '100%',
        }}
      >
        <img src="/images/vector-product.png" alt="" width='25px' height='25px' padding-top='-1px' /> Products / {title}
      </div>

      {/* H1 title */}
      <h1
        style={{
          fontSize: '72px',
          fontFamily: 'HPE Graphik, Metric, sans-serif',
          fontWeight: 500,
          color: '#292D3A',
          lineHeight: '100%',
          margin: 0,
          padding: 0,
          fontFamily: 'inherit',
        }}
      >
        {title}
      </h1>

      {/* Description — first paragraph of the page */}
      {description && (
        <p
          style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#606A70',
            lineHeight: '43px',
            margin: 0,
            maxWidth: '1600px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      )}

      {/* Horizontal nav pill bar — outer scrollable container */}
      {allItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: '1600px',
            height: '89px',
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              borderRadius: '100px',
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              height: '89px',
              boxSizing: 'border-box',
              gap: '0',
            }}
          >
            {allItems.map((item, i) => {
              const isActive = item.href === activeHref;
              return (
                <a
                  key={i}
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100px',
                    padding: '20px 36px',
                    height: '65px',
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
                    fontFamily: 'HPE Graphik, Metric, sans-serif',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

PlatformHeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ),
};

PlatformHeroSection.defaultProps = {
  description: '',
  navItems: [],
};

export default PlatformHeroSection;

