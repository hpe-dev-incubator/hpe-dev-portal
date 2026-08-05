import React from 'react';
import { Anchor, Box, Grommet, Heading, Main } from 'grommet';
import { Facebook, LinkedinOption, Upload, X } from 'grommet-icons';
import PropTypes from 'prop-types';
import { Header } from '../index';
import './reset.css';
import theme from './theme';

const LayoutSideBar = ({
  children,
  sidebarContent,
  sectionTitle,
  heroContent,
  layoutClassName,
}) => {
  const isPlatformLayout = layoutClassName === 'platform-layout';

  return (
    <Grommet theme={theme}>
      <Header />
      {heroContent && heroContent}
      {sectionTitle && (
        <Box pad={{ horizontal: '160px', top: '96px', bottom: '0' }}>
          <Box
            direction="row"
            align="center"
            justify="between"
            width="100%"
            margin="none"
          >
            <Heading
              level={2}
              responsive={false}
              margin="none"
              style={{
                fontWeight: 500,
                fontSize: '60px',
                lineHeight: 'normal',
                letterSpacing: '-1.04px',
                color: '#292D3A',
                whiteSpace: 'nowrap',
              }}
            >
              {sectionTitle}
            </Heading>
            <Box direction="row" gap="8px" align="start">
              <Anchor
                icon={<Upload size="36px" color="dark-1" />}
                href="#"
                style={{
                  padding: '16px',
                  borderRadius: '100px',
                  display: 'flex',
                }}
              />
              <Anchor
                icon={<LinkedinOption size="36px" color="dark-1" />}
                href="https://www.linkedin.com/company/hewlett-packard-enterprise"
                style={{
                  padding: '16px',
                  borderRadius: '100px',
                  display: 'flex',
                }}
              />
              <Anchor
                icon={<X size="36px" color="dark-1" />}
                href="https://twitter.com/HPE_Developer"
                style={{
                  padding: '16px',
                  borderRadius: '100px',
                  display: 'flex',
                }}
              />
              <Anchor
                icon={<Facebook size="36px" color="dark-1" />}
                href="https://facebook.com/hewlettpackardenterprise"
                style={{
                  padding: '16px',
                  borderRadius: '100px',
                  display: 'flex',
                }}
              />
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
  sectionTitle: PropTypes.string,
  heroContent: PropTypes.node,
  layoutClassName: PropTypes.string,
};

LayoutSideBar.defaultProps = {
  layoutClassName: '',
};

export default LayoutSideBar;
