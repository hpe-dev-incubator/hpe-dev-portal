import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';

export const Content = ({ children, pad, width, ...rest }) => (
  <Box
    width={width || 'xxlarge'}
    alignSelf="center"
    pad={{ horizontal: 'medium', ...pad }}
    {...rest}
  >
    {children}
  </Box>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  pad: PropTypes.shape({
    horizontal: PropTypes.string,
    vertical: PropTypes.string,
  }),
};

export default Content;
