import React from 'react';
import { Box } from 'grommet';
import { SocialMedia, Link } from '../index';

export const Footer = ({ ...rest }) => (
  <Box>
    <Box
      direction="row"
      align="center"
      justify="between"
      pad={{ horizontal: 'large' }}
      {...rest}
    >
      <Box direction="row" gap="medium" justify="center">
        <Link to="/opensource">Open Source</Link>
        <Link to="/events">Events</Link>
        <Link to="/community">Community</Link>
      </Box>
      <SocialMedia />
    </Box>
  </Box>
);

export default Footer;
