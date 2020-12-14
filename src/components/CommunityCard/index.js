import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Image, Text } from 'grommet';

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
    pad="medium"
    direction="row"
    overflow="hidden"
    wrap
  >
      <Box
        align="start"
        gap="medium"
        {...rest}
      >
        <Box  align="start">
          {image && <Image fit="contain" src={image} />}
        </Box>
        <Box>
          <Heading margin="none" level="4" color="#444444">
            {title}
          </Heading>
          <Text color="#666666"> {description}</Text>
        </Box>
        <Box wrap>
          <Button
            color="yellow"
            primary
            label={linkname}
            href={link}
            target="_Blank"
          />
        </Box>
      </Box>
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
