import React from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box, Main } from 'grommet';
import { useDarkMode } from '../../hooks';

import theme from './theme';
import './reset.css';
import { Footer, Header } from '../index';

const Layout = ({ children }) => {
  const { value } = useDarkMode(true);
  const themeMode = value ? 'dark' : 'light';
  return (
    <Grommet theme={theme} themeMode={themeMode}>
      <Box direction="row" justify="center">
        <Box basis="xxlarge" flex="shrink">
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
};

export default Layout;
