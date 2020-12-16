import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading, Text } from 'grommet';

const PageDescription = ({ image, title, description1, description2, children }) => {
  return (
    <Box
    flex
    overflow="auto"
    gap="medium"
    pad="large"
    wrap
  >
    <Box direction="row-responsive" align="center" gap="large" pad={{vertical:"large"}}>
        <Box pad={{horizontal:"large"}}>
            <Image  src={image} />
        </Box>
        <Box
        align="start"
        direction="column"
        >
            <Heading margin="none">{title}</Heading>
            <Text>
                {description1} 
            </Text>
            <Text>
            {description2}
            </Text>
        </Box>
    </Box>
    {children}
  </Box>
  );
};

PageDescription.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    description1: PropTypes.string,
    description2: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PageDescription;
