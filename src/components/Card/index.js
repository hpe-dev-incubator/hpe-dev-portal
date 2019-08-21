import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';

const colorMap = {
  Develop: '#FEC901',
  Design: '#7630EA',
  Event: '#CCCCCC',
  Community: '#0E5265',
  'Open Source': '#7630EA',
  Research: '#33DAC8',
};

const getColor = category => colorMap[category] || colorMap.Develop;

export const Card = ({ key, children, pad, width, gap, category, ...rest }) => (
  <Box
    key={key}
    margin="small"
    flex="grow"
    width={width || 'medium'}
    border={{
      side: 'top',
      color: getColor(category),
      size: 'medium',
    }}
  >
    <Box align="end">
      <Text color="light-5">{category}</Text>
    </Box>
    <Box
      fill="vertical"
      justify="center"
      align="center"
      gap={gap || 'none'}
      pad={{ horizontal: 'large', vertical: 'large', ...pad }}
      {...rest}
    >
      {children}
    </Box>
  </Box>
);

Card.propTypes = {
  key: PropTypes.string,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  gap: PropTypes.string,
  pad: PropTypes.shape({
    horizontal: PropTypes.string,
    vertical: PropTypes.string,
  }),
  category: PropTypes.string,
};

export default Card;
