import React from 'react';
import { Anchor, Box, Grommet, Heading, Main } from 'grommet';
import { Facebook, LinkedinOption, Twitter, Upload } from 'grommet-icons';
import PropTypes from 'prop-types';
import { Header } from '../index';
import './reset.css';
import theme from './theme';

const LayoutSideBar = ({ children, sidebarContent, sectionTitle, heroContent }) => {
  return (
    <Grommet theme={theme}>
      <Header />
      {heroContent && heroContent}
      {sectionTitle && (
        <Box
          direction="row"
          align="center"
          justify="between"
          pad={{ horizontal: 'medium', vertical: 'small' }}
          border={{ side: 'bottom', color: 'light-4' }}
          style={{ borderBottom: '1px solid #e8e8e8', minHeight: '52px' }}
        >
          <Heading level={3} margin="none" style={{ fontWeight: 600 }}>
            {sectionTitle}
          </Heading>
          <Box direction="row" gap="xsmall" align="center">
            <Anchor icon={<Upload size="18px" color="dark-4" />} href="#" />
            <Anchor icon={<LinkedinOption size="18px" color="dark-4" />} href="#" />
            <Anchor icon={<Twitter size="18px" color="dark-4" />} href="#" />
            <Anchor icon={<Facebook size="18px" color="dark-4" />} href="#" />
          </Box>
        </Box>
      )}
      <Box
        direction="row"
        justify="start"
        margin="none"
        pad="none"
        style={{ width: '100%', maxWidth: '1920px', opacity: 1 }}
      >
        <Box
          fill
          flex="shrink"
          margin="none"
          pad="none"
        >
          <Box direction="row" flex margin="none" pad="none" gap="12px">
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
        </Box>
      </Box>
    </Grommet>
  );
};

LayoutSideBar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node,
  sectionTitle: PropTypes.string,
  heroContent: PropTypes.node,
};

export default LayoutSideBar;
