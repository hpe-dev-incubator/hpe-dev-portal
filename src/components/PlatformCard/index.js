import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Heading, Image, Text } from 'grommet';
import { Link as GatsbyLink } from 'gatsby';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

export const PlatformCard = ({
  children,
  pad,
  width,
  gap,
  category,
  content,
  align,
  link,
  image,
  title,
  ...rest
}) => (
  <Box
    flex="grow"
    width={width || 'medium'}
    elevation="small"
    pad="small"
    direction="row-responsive"
  >
    <NavLink to={link}>
      <Box
        // fill="horizontal"
        direction="row-responsive"
        justify="between"
        align="center"
        gap={gap || 'medium'}
        pad={{ horizontal: 'small', vertical: 'small ', ...pad }}
        {...rest}
      >
        <Box height="small" width="small" align="center">
          {image && <Image fit="contain" src={image} />}
        </Box>
        <Box>
          <Box direction="column">
            <Heading color="#444444">{title} </Heading>
            <Text color="#666666"> {content}</Text>
          </Box>
        </Box>
      </Box>
    </NavLink>
  </Box>
);

PlatformCard.propTypes = {
  content: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.string,
  gap: PropTypes.string,
  pad: PropTypes.shape({
    horizontal: PropTypes.string,
    vertical: PropTypes.string,
  }),
  category: PropTypes.string,
  align: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
};

export default PlatformCard;
