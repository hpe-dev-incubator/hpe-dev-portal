import React from 'react';
import { Box } from 'grommet';
import { Search } from 'grommet-icons';
import { ButtonLink } from '..';

function Header() {
  return (
    <Box
      direction="row-responsive"
      pad={{ horizontal: 'medium' }}
      justify="between"
      wrap
    >
      <ButtonLink label="HPE Developer" to="/" />
      <Box direction="row-responsive" gap="medium" justify="between" wrap>
        <ButtonLink label="Open Source" to="/opensource" />
        <ButtonLink label="Platforms" to="/platform" />
        <ButtonLink label="Events" to="/events" />
        <ButtonLink label="Blog" to="/blog" />
        <ButtonLink label="Newsletter" to="/newsletter-signup" />
        <ButtonLink label="Join Community" to="/community" />
      </Box>
      <ButtonLink to="/search" icon={<Search />} label="Search" reverse />
    </Box>
  );
}
export default Header;
