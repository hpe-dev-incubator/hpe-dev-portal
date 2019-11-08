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
      <Link to="/">
        <Text weight="bold" color="dark-1">
          HPE Developer
        </Text>
      </Link>
      <Box direction="row" gap="medium" justify="center">
        <Link to="/research" color="neutral-4">
          Research
        </Link>
        <Link to="/design" color="neutral-4">
          Design
        </Link>
        <Link to="/develop" color="neutral-4">
          Develop
        </Link>
        <Link to="/blogs" color="neutral-4">
          Blog
        </Link>
        <Link to="/support" color="neutral-4">
          Support
        </Link>
      </Box>
    </Box>
  );
}
export default Header;
