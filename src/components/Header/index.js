import React from 'react';
import { Box, Text } from 'grommet';
import { Link } from '..';

function Header() {
  return (
    <Box
      direction="row-responsive"
      gap="small"
      pad={{ vertical: 'xsmall', horizontal: 'medium' }}
      justify="between"
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Text weight="bold" color="dark-1">
          HPE Developer
        </Text>
      </Link>
      <Box direction="row" gap="medium" justify="center">
        <Link to="/opensource">Open Source</Link>
        <Link to="/platforms">Platforms</Link>
        <Link to="/events">Events</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/newsletter">Newsletter</Link>
        <Link to="/community">Join Community</Link>
      </Box>
    </Box>
  );
}
export default Header;
