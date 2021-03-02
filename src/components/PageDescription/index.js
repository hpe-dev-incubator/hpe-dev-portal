import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading } from 'grommet';

const PageDescription = ({ image, title, children }) => {
  return (
    <Box direction="row-responsive" gap="large" margin={{ vertical: 'large' }}>
      <Box width={{ max: 'medium' }} margin={{ horizontal: 'large' }}>
        <Image src={image} />
      </Box>
      <Box justify="center" pad={{ horizontal: 'large' }}>
        <Heading margin="none">{title}</Heading>
        {children}
      </Box>
    </Box>
  );
};

PageDescription.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default PageDescription;
