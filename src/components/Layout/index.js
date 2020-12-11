import React from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box } from 'grommet';

import theme from './theme';
import './reset.css';
import { Footer, Header } from '../index';

const Layout = ({ children }) => {
  return (
    <Grommet
      full
      theme={theme}
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        minHeight: '100vh',
        height: 'auto',
      }}
    >
      <Header />
      <Box flex as="main">
        {children}
      </Box>
      <Footer />
    </Grommet>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
