import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box, Main } from 'grommet';
import { AppContext } from '../../providers/AppProvider';
import theme from './theme';
import './reset.css';
import { Footer, Header } from '../index';

const Layout = ({ children }) => {
  const { data } = useContext(AppContext);

  return (
    <Grommet theme={theme}>
      <Box direction="row" justify="center">
        <Box basis="xxlarge" flex="shrink">
          <Header data={data} />
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
