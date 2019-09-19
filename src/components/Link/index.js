import React from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'grommet';
import { navigate } from 'gatsby';

const Link = ({ children, to, ...rest }) => (
  <Anchor
    href={to}
    onClick={ev => {
      navigate(to);
      ev.preventDefault();
    }}
    {...rest}
  >
    {children}
  </Anchor>
);

Link.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
};
export default Link;
