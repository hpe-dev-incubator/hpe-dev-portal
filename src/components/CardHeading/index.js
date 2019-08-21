import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'grommet';

export const CardHeading = ({ children, ...rest }) => (
  <Heading margin={{ top: 'none', bottom: 'xsmall' }} level={2} {...rest}>
    {children}
  </Heading>
);

CardHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardHeading;
