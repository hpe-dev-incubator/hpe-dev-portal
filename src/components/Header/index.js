import React from 'react';
import { Box, Text } from 'grommet';
import { Link } from '..';
// import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Header() {
  // const siteMetadata = useSiteMetadata();

  return (
    <Box
      direction="row"
      gap="small"
      pad={{ vertical: 'xsmall', horizontal: 'medium' }}
      justify="between"
    >
      <Text weight="bold" color="dark-1">
        HPE Developer
      </Text>
      <Box direction="row" gap="medium" justify="center">
        <Link to="/research">Research</Link>
        <Link to="/design">Design</Link>
        <Link to="/develop">Develop</Link>
        <Link to="/support">Support</Link>
      </Box>
    </Box>
  );
}
export default Header;
