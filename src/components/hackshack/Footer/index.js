import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import { HPEDevFooter } from '../index';
import { StyledAnchor, FooterWrapper } from './styles';

const footerLinks = [
  {
    label: 'Privacy Policy',
    href: 'https://www.hpe.com/us/en/legal/privacy.html',
  },
  {
    label: 'Cookies',
    href: 'https://www.hpe.com/us/en/legal/privacy.html#datacollection',
  },
  {
    label: 'Terms of Use',
    href: 'https://www.hpe.com/us/en/about/legal/terms-of-use.html',
  },
  {
    label: 'Do Not Sell My Personal Information',
    href: 'https://www.hpe.com/us/en/privacy/personal-information.html',
  },
];

export const Footer = ({ size }) => {
  const dir = size === 'small' ? 'column' : 'row';
  const fontSize = size === 'small' ? '14px' : '18px';

  return (
    <Box>
      <HPEDevFooter size={size} />
      <FooterWrapper
        pad={size === 'small' ? 'medium' : 'small'}
        background="#FFFFFF"
        justify="between"
        direction={dir}
        align="start"
        gap="medium"
      >
        <Box>
          <Text size={fontSize}>
            &copy; 2020 Hewlett Packard Enterprise Development LP
          </Text>
        </Box>
        <Box direction={dir} gap="xxsmall">
          {footerLinks.map((link, index) => {
            const { label, href } = link;
            return (
              <StyledAnchor
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box direction="row" gap="xxsmall">
                  <Text size={fontSize} weight={900}>
                    {label}
                  </Text>
                  {footerLinks.length - 1 !== index && size !== 'small' && (
                    <Text size={fontSize}>|</Text>
                  )}
                </Box>
              </StyledAnchor>
            );
          })}
        </Box>
      </FooterWrapper>
    </Box>
  );
};

Footer.propTypes = {
  size: PropTypes.string,
};

export default Footer;
