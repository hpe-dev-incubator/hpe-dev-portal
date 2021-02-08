import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading } from 'grommet';
import { navigate } from 'gatsby';

const EventCard = ({ timeframe, link, image, title }) => (
  <Box
    elevation="medium"
    pad="large"
    wrap
    gap="large"
    onClick={link ? () => navigate(link) : undefined}
  >
    <Box direction="row-responsive" gap="large" align="center">
      <Box justify="between" direction="row-responsive">
        <Box gap="medium">
          <Box gap="small">
            <Heading margin="none">{title}</Heading>
            <Heading margin="none" level="3">
              {timeframe}
            </Heading>
          </Box>
        </Box>
        <Box>{image && <Image fit="contain" src={image} />}</Box>
      </Box>
    </Box>
  </Box>
);
EventCard.propTypes = {
  timeframe: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
};

export default EventCard;
