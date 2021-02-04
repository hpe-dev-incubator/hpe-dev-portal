import React from 'react';
import { Box } from 'grommet';
import { Search } from 'grommet-icons';
import { ButtonLink } from '..';

function Header() {
  return (
    <Box
      direction="row-responsive"
      gap="small"
      pad={{ vertical: 'xsmall', horizontal: 'medium' }}
      justify="between"
    >
      <ButtonLink label="HPE Developer" to="/" />
      <Box direction="row" gap="medium" justify="center">
        <ButtonLink label="Open Source" to="/opensource" />
        <ButtonLink label="Platforms" to="/platform" />
        <ButtonLink label="Events" to="/events" />
        <ButtonLink label="Blog" to="/blog" />
        <ButtonLink label="Newsletter" to="/newsletter" />
        <ButtonLink label="Join Community" to="/community" />
      </Box>
      <Box direction="row" gap="medium" justify="center">
        <ButtonLink to="/search" icon={<Search />} label="Search" reverse />
      </Box>
    </Box>
  );
}
export default Header;
