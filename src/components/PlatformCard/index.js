import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Heading, Image, Card as GrommetCard } from 'grommet';
import { navigate } from 'gatsby';

const PlatformCard = ({ description, link, image, title }) => (
  <GrommetCard
    elevation="medium"
    pad="large"
    gap="large"
    onClick={
      link
        ? (e) => {
            navigate(link);
            localStorage.setItem(
              'platformPosition',
              JSON.stringify(e.nativeEvent.pageY - e.nativeEvent.clientY),
            );
          }
        : undefined
    }
  >
    <Box direction="row-responsive" gap="large" align="center">
      <Box flex>
        {image && <Image fit="contain" src={image} alt="platform logo" />}
      </Box>
      <Box flex>
        <Heading margin="none" level="3" size="small">
          {title}
        </Heading>
        <Text>{description}</Text>
      </Box>
    </Box>
  </GrommetCard>
);

PlatformCard.propTypes = {
  description: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
};

export default PlatformCard;
