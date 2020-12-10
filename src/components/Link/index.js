import React from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'grommet';
import { navigate } from 'gatsby';

const Link = ({ to, ...rest }) => (
  <Anchor
    style={{ textDecoration: 'none' }}
    href={to}
    onClick={(ev) => {
      navigate(to);
      ev.preventDefault();
    }}
    {...rest}
  />
);

Link.propTypes = {
  to: PropTypes.string,
};
export default Link;
