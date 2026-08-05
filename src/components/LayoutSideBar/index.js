import React from 'react';
import { Anchor, Box, Grommet, Heading, Main } from 'grommet';
import { Facebook, LinkedinOption, Upload, X } from 'grommet-icons';
import PropTypes from 'prop-types';
import { Header } from '../index';
import './reset.css';
import theme from './theme';

const LayoutSideBar = ({ children, sidebarContent, sectionTitle, heroContent, layoutClassName }) => {
  const isPlatformLayout = layoutClassName === 'platform-layout';

  return (
    <Grommet theme={theme}>
      <Header />
      {heroContent && heroContent}
      {sectionTitle && (
        <Box
          align="center"
          pad={{ horizontal: '160px', vertical: '50px' }}
        >
          <Box
            direction="row"
            align="center"
            justify="between"
            width="1600px"
            margin="none"
            height="70px"
            style={{ opacity: 1, margin:'none' }}
          >
            <Heading
              level={2}
              margin="none"
              style={{
                fontWeight: 500,
                fontSize: '50px',
                lineHeight: '100%',
                letterSpacing: '0px',
                color: '#292D3A',
              }}
            >
              {sectionTitle}
            </Heading>
            <Box
              direction="row"
              gap="8px"
              align="center"
              justify="end"
              width="296px"
              height="100px"
            >
              <Anchor icon={<Upload size="20px" color="dark-1" />} href="#" />
              <Anchor icon={<LinkedinOption size="20px" color="dark-1" />} href="https://www.linkedin.com/company/hewlett-packard-enterprise" />
              <Anchor icon={<X size="20px" color="dark-1" />} href="https://twitter.com/HPE_Developer" />
              <Anchor icon={<Facebook size="20px" color="dark-1" />} href="https://facebook.com/hewlettpackardenterprise" />
            </Box>
          </Box>
        </Box>
      )}
      <Box
        className={layoutClassName}
        direction="row"
        justify="start"
        margin="none"
        pad={{
          top: isPlatformLayout ? '24px' : '96px',
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
        <Box
          fill
          flex="shrink"
          margin="none"
          pad="none"
        >
          <Box
            direction="row"
            align="start"
            margin="none"
            pad="none"
            gap="48px"
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
                overflow="scroll"
                style={{
                  maxHeight: 'calc(100vh - 100px)',
                }}
              >
                {sidebarContent}
              </Box>
            )}
            {/* Main Content */}
            <Main flex={true} fill={undefined} overflow="visible" margin="none" >
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
  layoutClassName: PropTypes.string,
};

LayoutSideBar.defaultProps = {
  layoutClassName: '',
};

export default LayoutSideBar;