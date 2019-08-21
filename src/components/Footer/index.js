import React from 'react';
import { Box } from 'grommet';
import { SocialMedia, StyledLink } from '../index';

export const Footer = ({ ...rest }) => (
  <Box>
    <Box
      direction="row"
      align="center"
      justify="between"
      pad={{ horizontal: 'large' }}
    >
      <Box direction="row" gap="medium" justify="center">
        <StyledLink to="/opensource">Open Source</StyledLink>
        <StyledLink to="/events">>Events</StyledLink>
        <StyledLink to="/community">Community</StyledLink>
      </Box>
      <SocialMedia />
    </Box>
    <Box background="light-2" pad={{ vertical: 'medium' }} {...rest} />
  </Box>
);

export default Footer;
