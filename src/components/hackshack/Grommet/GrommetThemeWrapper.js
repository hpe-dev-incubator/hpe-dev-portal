import React from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import PropTypes from 'prop-types';

const customHpe = deepMerge(hpe, {
  global: {
    breakpoints: {
      small: {
        value: 900,
      },
    },
  },
});

const GrommetThemeWrapper = ({ children }) => {
  return (
    <Grommet
      className="Test-abc-123"
      theme={customHpe}
      themeMode="dark"
      background="#151d29"
      style={{ overflowX: 'hidden' }}
    >
      {children}
    </Grommet>
  );
};

GrommetThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GrommetThemeWrapper;
