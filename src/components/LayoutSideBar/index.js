import React from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box, Main } from 'grommet';
import theme from './theme';
import './reset.css';
import { Footer, Header } from '../index';

const LayoutSideBar = ({ children, sidebarContent }) => {
  return (
    <Grommet theme={theme}>
      <Box direction="row" justify="start" margin="none" pad="none">
        <Box basis="xxlarge" flex="shrink" margin="none" pad="none">
          <Header />
          <Box direction="row" flex margin="none" pad="none">
            {/* Sidebar */}
            {sidebarContent && (
              <Box
                className="sidebar-content"
                width="220px"
                pad="medium"
                flex={{ shrink: 0 }}
                margin="none"
              >
                {sidebarContent}
              </Box>
            )}
            {/* Main Content */}
            <Main flex={true} fill={undefined} overflow="visible" margin="none">
              {children}
            </Main>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Grommet>
  );
};

LayoutSideBar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node,
};

export default LayoutSideBar;