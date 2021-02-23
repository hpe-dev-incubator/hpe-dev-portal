import React from 'react';
import { Box } from 'grommet';
import { Search } from 'grommet-icons';
import { ButtonLink, ExternalButtonLink } from '..';

function Header() {
  return (
    <Box
      direction="row-responsive"
      pad={{ horizontal: 'medium' }}
      justify="between"
      wrap
    >
      <ButtonLink label="HPE Developer" to="/" />
      <Box direction="row" gap="medium" wrap>
        <ExternalButtonLink
          label="Open Source"
          to="https://www.hpe.com/us/en/open-source.html"
        />
        <ButtonLink label="Platforms" to="/platform" />
        <ButtonLink label="Events" to="/events" />
        <ButtonLink label="Skill Up" to="/skillup" />
        <ButtonLink label="Blog" to="/blog" />
        <ButtonLink label="Newsletter" to="/newsletter-signup" />
        <ButtonLink label="Community" to="/community" />
      </Box>
      <ButtonLink
        align="start"
        alignSelf="start"
        to="/search"
        icon={<Search />}
        label="Search"
        reverse
      />
    </Box>
  );
}
export default Header;
