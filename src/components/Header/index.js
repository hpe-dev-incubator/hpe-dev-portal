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
        <Link to="/research">Research</Link>
        <Link to="/design">Design</Link>
        <Link to="/develop">Develop</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/support">Support</Link>
      </Box>
    </Box>
  );
}
export default Header;
