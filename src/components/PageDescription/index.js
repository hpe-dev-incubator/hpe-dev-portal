import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading } from 'grommet';

const PageDescription = ({ image, title, children }) => {
  return (
    <Box
      direction="row-responsive"
      align="center"
      gap="large"
      pad={{ vertical: 'large' }}
    >
      <Box>
        <Image src={image} />
      </Box>
      <Box align="start" direction="column">
        <Heading margin="none">{title}</Heading>
        {children}
      </Box>
    </Box>
  );
};

PageDescription.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PageDescription;
