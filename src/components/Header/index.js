import React from 'react';
import { Link } from 'gatsby';
import { Box, Text } from 'grommet';
import { Hpe, More } from 'grommet-icons';
import { StyledLink } from '../StyledLink';
// import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Header() {
  // const siteMetadata = useSiteMetadata();

  return (
    <Box>
      <Box
        direction="row"
        gap="small"
        pad={{ vertical: 'small', horizontal: 'medium' }}
        justify="between"
      >
        <Link to="/">
          <Hpe color="brand" />
        </Link>
        <More />
      </Box>
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
          <StyledLink to="/research">Research</StyledLink>
          <StyledLink to="/design">Design</StyledLink>
          <StyledLink to="/develop">Develop</StyledLink>
          <StyledLink to="/support">Support</StyledLink>
        </Box>
      </Box>
    </Box>
  );
}
export default Header;
