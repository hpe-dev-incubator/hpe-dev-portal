import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text } from 'grommet';

const colors = {
  develop: 'accent-4', // HPE Yellow
  design: 'accent-2', // HPE Medium Purple
  event: 'status-unknown',
  community: 'neutral-1', // HPE Dark Blue
  'open source': 'accent-2', // HPE Medium Purple
  research: 'accent-1', // HPE Medium Blue
};

export const Title = ({ children, ...rest }) => (
  <Heading margin={{ top: 'none', bottom: 'xsmall' }} level={2} {...rest}>
    {children}
  </Heading>
);

Title.propTypes = {
  children: PropTypes.node.isRequired,
};

const Description = ({ children, ...rest }) => (
  <Text size="xlarge" color="dark-3" {...rest}>
    {children}
  </Text>
);

Description.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export const Card = ({ key, children, pad, width, gap, category, ...rest }) => (
  <Box
    key={key}
    margin="small"
    flex="grow"
    width={width || 'medium'}
    border={{
      side: 'top',
      color: colors[category ? category.toLowerCase() : 'develop'],
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

Card.Title = Title;
Card.Description = Description;

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
