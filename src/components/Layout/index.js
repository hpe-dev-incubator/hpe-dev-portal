import React from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box, Main } from 'grommet';
import theme from './theme';
import './reset.css';
import { Footer, Header } from '../index';

const Layout = ({ children, fullWidth = false }) => {
  return (
    <Grommet theme={theme}>
      <Box direction="row" justify={fullWidth ? undefined : 'center'}>
        <Box
          basis={fullWidth ? undefined : 'xxlarge'}
          flex="shrink"
          fill={fullWidth ? 'horizontal' : undefined}
        >
          <Header />
          <Main flex={false} fill={undefined} overflow="visible">
            {children}
          </Main>
          <Footer />
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
