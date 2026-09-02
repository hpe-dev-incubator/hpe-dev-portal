import { Box, Heading } from 'grommet';
import React from 'react';
import PropTypes from 'prop-types';

const ReusableHeroSection = ({
  title,
  children,
  image,
  alt,
  backgroundPosition,
  showRightMidGradient,
}) => {
  return (
    <Box
      fill="horizontal"
      height="583px"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition,
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Gradient Overlay */}
      <Box
        fill
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background:
            'linear-gradient(-42.143deg, rgba(41, 45, 58, 0) 10.197%, rgb(41, 45, 58) 89.615%)',
          pointerEvents: 'none',
        }}
      />

      {showRightMidGradient && (
        <Box
          fill
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(270deg, rgba(41, 45, 58, 0.62) 0%, rgba(41, 45, 58, 0.34) 28%, rgba(41, 45, 58, 0.12) 44%, rgba(41, 45, 58, 0) 50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content */}
      <Box
        fill="horizontal"
        height="100%"
        align="start"
        justify="center"
        direction="column"
        style={{
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          minWidth: 0,
          padding: '96px max(160px, calc((100% - 1600px) / 2))',
        }}
      >
        <Box
          gap="64px"
          width="100%"
          style={{ maxWidth: '1152px' }}
          direction="column"
        >
          <Heading
            level="1"
            margin="0"
            color="white"
            style={{
              fontFamily: "'HPE Graphik', 'Metric', Arial, sans-serif",
              fontWeight: 500,
              fontSize: '68px',
              lineHeight: '74px',
              letterSpacing: '-2.72px',
            }}
          >
            {title}
          </Heading>
          <Box
            style={{
              fontFamily: "'HPE Graphik', 'Metric', Arial, sans-serif",
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '28px',
              lineHeight: '38px',
              letterSpacing: '-0.28px',
              verticalAlign: 'middle',
              color: 'white',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ReusableHeroSection.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  alt: PropTypes.string,
  backgroundPosition: PropTypes.string,
  showRightMidGradient: PropTypes.bool,
};

ReusableHeroSection.defaultProps = {
  image: null,
  title: '',
  children: null,
  alt: '',
  backgroundPosition: 'center',
  showRightMidGradient: false,
};

export default ReusableHeroSection;
