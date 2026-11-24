import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading } from 'grommet';

const PageDescription = ({ title, titleStyle, children }) => {
  return (
    <Box
      direction="row-responsive"
      gap="large"
      margin={{ vertical: 'large', horizontal: 'large' }}
    >
      {/* <Box width={{ max: 'medium' }} margin={{ horizontal: 'large' }}>
        <Image src={image} alt={alt} />
      </Box> */}
      <Box justify="center" pad={{ horizontal: 'large' }}>
        <Heading margin="none" style={titleStyle}>
          {title}
        </Heading>
        {children}
      </Box>
    </Box>
  );
};

PageDescription.propTypes = {
  // image: PropTypes.string,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  children: PropTypes.node,
  // alt: PropTypes.string,
};

export default PageDescription;
