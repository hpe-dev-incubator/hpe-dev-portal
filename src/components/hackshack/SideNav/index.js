import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Heading } from 'grommet';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';

const getNavColor = (active, hover) => {
  if (active) return 'white';
  if (hover) return 'white';
  return 'rgba(255, 255, 255, 0.3)';
};

const SideNavContainer = styled(Box)`
  z-index: 1;
`;

const NavButton = ({ active, to, children, size }) => {
  const [hover, setHover] = useState(false);

  return (
    <Button
      plain
      onClick={() => {
        navigate(to);
      }}
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onBlur={() => setHover(false)}
    >
      <Heading
        margin="none"
        size={size === 'small' ? 'medium' : 'small'}
        color={getNavColor(active, hover)}
      >
        {children}
      </Heading>
    </Button>
  );
};

NavButton.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  size: PropTypes.string,
};

const SideNav = ({ size }) => {
  const location = useLocation();
  return (
    <SideNavContainer align="start" gap="xsmall" width={{ min: '250px' }}>
      <NavButton active={location.pathname === '/'} to="/" size={size}>
        HACK SHACK
      </NavButton>
      <NavButton
        active={location.pathname === '/workshops'}
        to="/workshops"
        size={size}
      >
        WORKSHOPS
      </NavButton>
      <NavButton
        active={location.pathname === '/challenges'}
        to="/challenges"
        size={size}
      >
        CHALLENGES
      </NavButton>
      <NavButton
        active={location.pathname === '/ezmeral'}
        to="/ezmeral"
        size={size}
      >
        HPE EZMERAL
      </NavButton>
      <NavButton
        active={location.pathname === '/replays/:replayId'}
        to="/replays/0"
        size={size}
      >
        REPLAYS
      </NavButton>
      <NavButton
        active={location.pathname === '/community'}
        to="/community"
        size={size}
      >
        COMMUNITY
      </NavButton>
      <NavButton
        active={
          location.pathname === '/arcade' ||
          location.pathname === '/sticker-wall' ||
          location.pathname === '/competiton'
        }
        to="/arcade"
        size={size}
      >
        ARCADE
      </NavButton>
    </SideNavContainer>
  );
};

SideNav.propTypes = {
  size: PropTypes.string,
};

export default SideNav;
