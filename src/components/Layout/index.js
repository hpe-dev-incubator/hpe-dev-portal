import { Box, Grommet, Main } from 'grommet';
import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../index';
import './reset.css';
import theme from './theme';

const Layout = ({ children, fullWidth = false }) => {
  return (
    <Grommet theme={theme}>
      <Header />
      <Box direction="row" justify={fullWidth ? undefined : 'center'}>
        <Box
          basis={fullWidth ? undefined : 'xxlarge'}
          flex="shrink"
          fill={fullWidth ? 'horizontal' : undefined}
        >
          <Main flex={false} fill={undefined} overflow="visible">
            {children}
          </Main>
        </Box>
      </Box>
    </Grommet>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
};

export default Layout;
