import React, { useContext } from 'react';
import {
  Box,
  DropButton,
  Header as GrommetHeader,
  Nav,
  ResponsiveContext,
} from 'grommet';
import { Menu, Search } from 'grommet-icons';
import { ButtonLink, ExternalButtonLink, ThemeModeToggle } from '..';

function Header() {
  const size = useContext(ResponsiveContext);
  const navLinks = [
    <ExternalButtonLink
      key="os"
      label="Open Source"
      to="https://www.hpe.com/us/en/open-source.html"
    />,
    <ButtonLink key="pl" label="Platforms" to="/platform" />,
    <ButtonLink key="ev" label="Events" to="/events" />,
    <ButtonLink key="su" label="Skill Up" to="/skillup" />,
    <ButtonLink key="bl" label="Blog" to="/blog" />,
    <ButtonLink key="nw" label="Newsletter" to="/newsletter-signup" />,
    <ButtonLink key="cm" label="Community" to="/community" />,
  ];

  return (
    <GrommetHeader
      justify="between"
      pad={{ horizontal: 'medium', vertical: 'small' }}
    >
      <Box flex={false}>
        <ButtonLink label="HPE Developer" to="/" />
      </Box>
      {size === 'small' ? (
        <DropButton
          icon={<Menu />}
          dropAlign={{ top: 'bottom' }}
          dropContent={<Nav direction="column">{navLinks}</Nav>}
        />
      ) : (
        <Box flex="shrink" overflow="hidden">
          <Nav direction="row" gap="medium">
            {navLinks.map((l, index) => (
              <Box key={index} flex={false}>
                {l}
              </Box>
            ))}
          </Nav>
        </Box>
      )}
      <Box direction="row" flex="shrink" overflow="hidden">
        <ButtonLink
          align="start"
          to="/search"
          icon={<Search />}
          label="Search"
          reverse
        />
        <ThemeModeToggle />
      </Box>
    </GrommetHeader>
  );
}
export default Header;
