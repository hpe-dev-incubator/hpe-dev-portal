import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Navigation = styled.nav`
  min-width: 0;
  max-width: 100%;
  padding: 20px 0;
  border-radius: 16px;
  position: relative;
  z-index: 1;
  font-family: 'HPE Graphik', Metric, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0;
  color: ${({ $inverse }) => ($inverse ? '#ffffff' : '#606a70')};

  > ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    list-style: none;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    max-width: 100%;
    font: inherit;
  }

  a,
  span[aria-current] {
    min-width: 0;
    overflow-wrap: anywhere;
    font: inherit;
    color: inherit;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    text-decoration: underline;
  }

  span[aria-current] {
    font-weight: 500;
    color: ${({ $inverse }) => ($inverse ? '#ffffff' : '#3e4550')};
  }
`;

const Separator = styled.span`
  position: relative;
  width: 12px;
  height: 24px;
  flex-shrink: 0;

  img {
    position: absolute;
    top: -0.5px;
    left: -0.5px;
    max-width: none;
  }
`;

const Breadcrumbs = ({ items, inverse }) => (
  <Navigation aria-label="Breadcrumb" $inverse={inverse}>
    <ol>
      {items.map((item, index) => (
        <li key={`${item.label}-${item.href || 'current'}`}>
          {index > 0 && (
            <Separator aria-hidden="true">
              <img src="/images/breadcrumb-separator.svg" alt="" />
            </Separator>
          )}
          {index === items.length - 1 ? (
            <span aria-current="page">{item.label}</span>
          ) : (
            <a href={item.href} onClick={item.onClick}>
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ol>
  </Navigation>
);

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ).isRequired,
  inverse: PropTypes.bool,
};

Breadcrumbs.defaultProps = {
  inverse: false,
};

export default Breadcrumbs;
