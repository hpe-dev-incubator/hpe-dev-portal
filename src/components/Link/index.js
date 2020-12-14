import React from 'react';
import PropTypes from 'prop-types';
import { Anchor, Button } from 'grommet';
import { navigate } from 'gatsby';

export const Link = ({ to, ...rest }) => (
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

export const ButtonLink = ({ to, ...rest }) => (
  <Button
    href={to}
    onClick={(ev) => {
      navigate(to);
      ev.preventDefault();
    }}
    {...rest}
  />
);

ButtonLink.propTypes = {
  to: PropTypes.string,
};
