import React from 'react';
import PropTypes from 'prop-types';
import { Anchor, Button } from 'grommet';
import { navigate } from 'gatsby';

export const Link = ({ to, ...rest }) => (
  <Anchor
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

export const ExternalLink = ({ to, ...rest }) => (
  <Anchor href={to} target="_blank" rel="noopener noreferrer" {...rest} />
);

ExternalLink.propTypes = {
  to: PropTypes.string,
};

export const ExternalButtonLink = ({ to, ...rest }) => (
  <Button href={to} target="_blank" rel="noopener noreferrer" {...rest} />
);
ExternalButtonLink.propTypes = {
  to: PropTypes.string,
};

export const ButtonLink = ({ to, state, ...rest }) => (
  <Button
    href={to}
    style={{ zIndex: 100 }}
    onClick={(ev) => {
      navigate(to, state);
      ev.preventDefault();
    }}
    {...rest}
  />
);

ButtonLink.propTypes = {
  to: PropTypes.string,
  state: PropTypes.shape({
    isBlogHeaderClicked: PropTypes.bool,
  }),
};
