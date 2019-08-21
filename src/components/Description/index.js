import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'grommet';

export const Description = ({ children, ...rest }) => (
  <Text color="dark-3" size="xlarge" {...rest}>
    {children}
  </Text>
);

Description.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export default Description;
