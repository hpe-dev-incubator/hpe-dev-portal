import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading } from 'grommet';

const PageDescription = ({ image, title, alignSelf, children }) => {
  return (
    <Box direction="row-responsive" align="center" gap="large">
      <Box>
        <Image src={image} />
      </Box>
      <Box align="start" alignSelf={alignSelf} direction="column">
        <Heading margin="none">{title}</Heading>
        {children}
      </Box>
    </Box>
  );
};

PageDescription.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  alignSelf: PropTypes.string,
  children: PropTypes.node,
};

export default PageDescription;
