import React from 'react';
import { Box, Grommet, Main } from 'grommet';
import PropTypes from 'prop-types';
import { Header } from '../index';
import './reset.css';
import theme from './theme';

const LayoutSideBar = ({
  children,
  sidebarContent,
  heroContent,
  layoutClassName,
}) => {
  const isPlatformLayout = layoutClassName === 'platform-layout';

  return (
    <Grommet theme={theme}>
      <Header />
      {heroContent && heroContent}
      <Box
        className={layoutClassName}
        direction="row"
        justify="start"
        margin="none"
        pad={{
          top: isPlatformLayout ? '48px' : '96px',
          right: '160px',
          bottom: '96px',
          left: '160px',
        }}
        style={{
          width: '100%',
          maxWidth: '1920px',
          opacity: 1,
          margin: '0 auto',
        }}
      >
        <Box fill flex="shrink" margin="none" pad="none">
          <Box
            direction="row"
            align="start"
            margin="none"
            pad="none"
            gap="72px"
            width="100%"
            style={{ maxWidth: '1600px', opacity: 1 }}
          >
            {/* Sidebar */}
            {sidebarContent && (
              <Box
                className="sidebar-content"
                width="336px"
                pad="none"
                flex={{ shrink: 0 }}
                margin="none"
                overflow={{ vertical: 'auto', horizontal: 'hidden' }}
                style={{
                  maxHeight: 'calc(100vh - 100px)',
                }}
              >
                {sidebarContent}
              </Box>
            )}
            {/* Main Content */}
            <Main flex={true} fill={undefined} overflow="visible" margin="none">
              {children}
            </Main>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};

LayoutSideBar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node,
  heroContent: PropTypes.node,
  layoutClassName: PropTypes.string,
};

LayoutSideBar.defaultProps = {
  layoutClassName: '',
};

export default LayoutSideBar;
