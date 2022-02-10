import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Image, Button } from 'grommet';
import { FooterWrapper } from '../Footer/styles';

const footerLinks = [
  { label: 'Platforms', href: 'https://developer.hpe.com/platforms' },
  { label: 'Open Source', href: 'https://developer.hpe.com/projects' },
  { label: 'Community', href: 'https://developer.hpe.com/community' },
  { label: 'Events', href: 'https://developer.hpe.com/events' },
];

export const HPEDevFooter = ({ size }) => {
  const fontSize = size === 'small' ? '20px' : '22px';
  const iconSize = size === 'small' ? '40px' : '48px';

  return (
    <FooterWrapper
      direction="row"
      align="start"
      justify="between"
      border="top"
      pad={size === 'small' ? 'medium' : 'small'}
    >
      <Button
        href="https://hpedev.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Box direction="row" gap="small" align="center">
          <Box width={iconSize} height={iconSize}>
            <Image fit="contain" src="/img/hackshack/hpeDevLogo.svg" />
          </Box>
          <Text size={fontSize} color="#FFFFFF">
            <Text weight="bold" size={fontSize}>
              HPE{' '}
            </Text>
            Developer
          </Text>
        </Box>
      </Button>
      {size !== 'small' && (
        <Box gap="medium" direction="row" alignSelf="center">
          {footerLinks.map((link) => {
            const { label, href } = link;
            return (
              <Button
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text color="#FFFFFF" size={fontSize} weight={900}>
                  {label}
                </Text>
              </Button>
            );
          })}
        </Box>
      )}
    </FooterWrapper>
  );
};

HPEDevFooter.propTypes = {
  size: PropTypes.string,
};

export default HPEDevFooter;
