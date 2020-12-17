import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Heading, Image, Text } from 'grommet';
import { Link as GatsbyLink } from 'gatsby';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

export const PlatformCard = ({ content, link, image, title }) => (
  <Box elevation="medium" pad="large" direction="row" wrap gap="large">
    <NavLink to={link}>
      <Box direction="row-responsive" gap="large" align="center">
        <Box height="small" width="small">
          {image && <Image fit="contain" src={image} />}
        </Box>
        <Box>
          <Box>
            <Heading margin="none" level="4">
              {title}
            </Heading>
            <Text> {content}</Text>
          </Box>
        </Box>
      </Box>
    </NavLink>
  </Box>
);

PlatformCard.propTypes = {
  content: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
};

export default PlatformCard;
