import React from 'react';
import PropTypes from 'prop-types';

import { Box, Heading, Text, Button } from 'grommet';

export const Hero = ({ title, desc, bg }) => (
  <Box pad="large" height="large" background={`url(${bg})`} justify="center">
    <Box width="large" gap="medium">
      <Heading size="large" color="white" margin="none">
        {title}
      </Heading>
      <Text color="white">{desc}</Text>
      <Box direction="row" gap="small">
        <Button
          primary
          color="brand"
          label={<Text weight="bold">Learn more</Text>}
        />
        <Button
          color="brand"
          label={
            <Text color="light-1" weight="bold">
              Login
            </Text>
          }
          onClick={() => {}}
        />
      </Box>
    </Box>
  </Box>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  bg: PropTypes.string.isRequired,
};

export default Hero;
