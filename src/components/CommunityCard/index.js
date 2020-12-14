import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Image, Text } from 'grommet';
import { Link as GatsbyLink } from 'gatsby';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

export const CommunityCard = ({
  title,
  link,
  linkname,
  description,
  priority,
  image,
  ...rest
}) => (
  <Box
    flex="grow"
    width="medium"
    elevation="small"
    pad="small"
    direction="row"
    overflow="hidden"
    wrap
  >
    <NavLink to={link}>
      <Box
        // fill="horizontal"
        justify="between"
        align="start"
        gap='medium'
        pad={{ horizontal: 'small' }}
        // pad={{ horizontal: 'small', vertical: 'small ', ...pad }}
        {...rest}
      >
        <Box height="small" width="small" align="center">
          {image && <Image fit="contain" src={image} />}
        </Box>
        <Box>
          <Heading level="4" color="#444444">
            {title}{' '}
          </Heading>
          <Text color="#666666"> {description}</Text>
        </Box>
        <Box wrap>
          <Button
            color="yellow"
            primary
            label={linkname}
            href={linkname}
            target="_Blank"
          />
        </Box>
      </Box>
    </NavLink>
  </Box>
);

CommunityCard.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  linkname: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  priority: PropTypes.number,
};

export default CommunityCard;
