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
      <NavButton
        active={location.pathname === '/hackshack'}
        to="/hackshack"
        size={size}
      >
        HACK SHACK
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/workshops'}
        to="/hackshack/workshops"
        size={size}
      >
        WORKSHOPS
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/challenges'}
        to="/hackshack/challenges"
        size={size}
      >
        CHALLENGES
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/ezmeral'}
        to="/hackshack/ezmeral"
        size={size}
      >
        HPE EZMERAL
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/replays/:replayId'}
        to="/hackshack/replays/0"
        size={size}
      >
        REPLAYS
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/community'}
        to="/hackshack/community"
        size={size}
      >
        COMMUNITY
      </NavButton>
      <NavButton
        active={
          location.pathname === '/hackshack/arcade' ||
          location.pathname === '/hackshack/sticker-wall' ||
          location.pathname === '/hackshack/competiton'
        }
        to="/hackshack/arcade"
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
