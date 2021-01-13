import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Card as GrommetCard, CardHeader, Image } from 'grommet';
import { navigate } from 'gatsby';
import { Star } from 'grommet-icons';

const OpenSourceCard = ({ image, title, link, description, category }) => (
  <GrommetCard
    pad="large"
    elevation="medium"
    wrap
    onClick={link ? () => navigate(link) : undefined}
  >
    <CardHeader
      justify="end"
      pad={{ top: 'none', bottom: 'medium', horizontal: 'small' }}
    >
      <Text color="text-weak">{category}</Text>
    </CardHeader>
    <Box gap="small" direction="row">
      <Box basis="1/3" alignSelf="center">
        <Box align="start">
          <Image fit="contain" src={image} />
        </Box>
        <Box direction="row" gap="xsmall" pad={{ top: 'xsmall' }}>
          <Star color="yellow" />
          <Text size="large" weight="bold">
            123
          </Text>
        </Box>
      </Box>
      <Box basis="2/3" alignSelf="center">
        <Text size="large" weight="bold">
          {title}
        </Text>
        <Text margin="none" size="large">
          {description.substring(0, 200)}
        </Text>
      </Box>
    </Box>
  </GrommetCard>
);

OpenSourceCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  category: PropTypes.string,
};

export default OpenSourceCard;
