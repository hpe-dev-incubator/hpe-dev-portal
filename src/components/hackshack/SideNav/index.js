import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Heading, DropButton, ResponsiveContext } from 'grommet';
import { Search, FormDown } from 'grommet-icons';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import { ButtonLink } from '../..';

const getNavColor = (active, hover) => {
  if (active) return 'white';
  if (hover) return 'white';
  return 'rgba(255, 255, 255, 0.3)';
};

const TextAlignLeft = styled(Box)`
  & > a {
    text-align: left;
    font-weight: 400;
    padding-right: 30px;
  }
`;

const SideNavContainer = styled(Box)`
  z-index: 1;
`;

const NavButton = ({ active, to, children }) => {
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
      <Heading margin="none" size="small" color={getNavColor(active, hover)}>
        {children}
      </Heading>
    </Button>
  );
};

NavButton.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

const SideNav = ({ data }) => {
  const size = useContext(ResponsiveContext);
  const location = useLocation();
  const platforms = data?.platform?.edges;
  const opensource = data?.opensource?.edges;

  const PlatformButtonLinks = ({ column }) => {
    const leftColumn = platforms.filter((platform, index) => index % 2 === 0);
    const rightColumn = platforms.filter((platform, index) => index % 2);
    const platformsColumn = column === 'left' ? leftColumn : rightColumn;

    return platformsColumn.map((platform, index) => {
      const { slug } = platform.node.fields;
      const { title } = platform.node.frontmatter;

      return (
        <ButtonLink
          key={index}
          label={title}
          to={`/platform${slug}`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });
  };

  const OpenSourceButtonLinks = ({ column }) => {
    const leftColumn = opensource.filter((os, index) => index % 2 === 0);
    const rightColumn = opensource.filter((os, index) => index % 2);
    const osColumn = column === 'left' ? leftColumn : rightColumn;

    return osColumn.map((os, index) => {
      const { slug } = os.node.fields;
      const s = slug.toLowerCase();
      const { title } = os.node.frontmatter;

      return (
        <ButtonLink
          key={index}
          label={title}
          to={`/platform${s}home`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });
  };
  return (
    <SideNavContainer align="start" gap="xsmall" width={{ min: '250px' }}>
      <NavButton active={location.pathname === '/hackshack'} to="/hackshack">
        HACK SHACK
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/workshops'}
        to="/hackshack/workshops"
      >
        WORKSHOPS
      </NavButton>
      <NavButton
        active={location.pathname === '/hackshack/challenges'}
        to="/hackshack/challenges"
      >
        CHALLENGES
      </NavButton>
      {/* <NavButton
        active={location.pathname === '/hackshack/ezmeral'}
        to="/hackshack/ezmeral"
      >
        HPE EZMERAL
      </NavButton> */}
      {/* <NavButton
        active={location.pathname === '/hackshack/replays/:replayId'}
        to="/hackshack/replays/0"
      >
        REPLAYS
      </NavButton> */}
      <NavButton
        active={
          location.pathname === '/hackshack/arcade' ||
          location.pathname === '/hackshack/sticker-wall' ||
          location.pathname === '/hackshack/competiton'
        }
        to="/hackshack/arcade"
      >
        ARCADE
      </NavButton>
      {size === 'small' && (
        <Box border="top">
          <DropButton
            label="OpenSource"
            align="start"
            dropAlign={{ top: 'bottom', left: 'left' }}
            icon={<FormDown />}
            reverse
            dropContent={
              <TextAlignLeft>
                <ButtonLink
                  key="pl"
                  label="All Open Source"
                  to="/opensource"
                  state={{ state: { isPlatformHeaderClicked: true } }}
                  alignSelf="start"
                  fill="horizontal"
                />
                <Box direction="row">
                  <TextAlignLeft>
                    <OpenSourceButtonLinks column="left" />
                  </TextAlignLeft>
                  <TextAlignLeft>
                    <OpenSourceButtonLinks column="right" />
                  </TextAlignLeft>
                </Box>
              </TextAlignLeft>
            }
          />
          <DropButton
            label="Our Platforms"
            dropAlign={{ top: 'bottom', left: 'left' }}
            icon={<FormDown />}
            reverse
            dropContent={
              <TextAlignLeft>
                <ButtonLink
                  key="pl"
                  label="All Technologies"
                  to="/platforms"
                  state={{ state: { isPlatformHeaderClicked: true } }}
                  alignSelf="start"
                  fill="horizontal"
                />
                <Box direction="row">
                  <TextAlignLeft>
                    <PlatformButtonLinks column="left" />
                  </TextAlignLeft>
                  <TextAlignLeft>
                    <PlatformButtonLinks column="right" />
                  </TextAlignLeft>
                </Box>
              </TextAlignLeft>
            }
          />
          <ButtonLink align="start" key="yr" label="Your Role" to="/role" />
          <ButtonLink align="start" key="ev" label="Events" to="/events" />
          <ButtonLink align="start" key="su" label="Skill Up" to="/skillup" />
          <ButtonLink
            align="start"
            key="bl"
            label="Blogs"
            to="/blog"
            state={{ state: { isBlogHeaderClicked: true } }}
          />
          <ButtonLink
            align="start"
            key="cm"
            label="Community"
            to="/community"
          />
          <ButtonLink
            align="start"
            to="/search"
            icon={<Search />}
            label="Search"
            reverse
          />
        </Box>
      )}
    </SideNavContainer>
  );
};

SideNav.propTypes = {
  data: PropTypes.any,
};

export default SideNav;
