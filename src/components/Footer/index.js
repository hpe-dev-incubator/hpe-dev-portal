import React from 'react';
import { Box } from 'grommet';
import { SocialMedia, Link } from '../index';

export const Footer = ({ ...rest }) => (
  <Box>
    <Box
      direction="row-responsive"
      align="center"
      justify="between"
      pad={{ horizontal: 'medium' }}
      {...rest}
    >
      <Box direction="row" gap="medium" justify="center">
        <Link to="/opensource" color="neutral-4">
          Open Source
        </Link>
        <Link to="/events" color="neutral-4">
          Events
        </Link>
        <Link to="/community" color="neutral-4">
          Community
        </Link>
        <Link to="/newsletter-signup" color="neutral-4">
          Sign up for our newsletter
        </Link>
      </Box>
      <SocialMedia />
    </Box>
  </Box>
);

export default Footer;
