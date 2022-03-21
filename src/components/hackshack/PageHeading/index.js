/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading } from 'grommet';
import { MainTitle } from '../StyledComponents';

export const PageHeader = ({ children, title, ...rest }) => {
  return (
    <MainTitle align="start" fill direction="column" {...rest}>
      <Box align="start">
        <Heading
          color="text-strong"
          level="1"
          margin={{ bottom: 'large', top: 'none' }}
        >
          {title}
        </Heading>
      </Box>
      {children}
    </MainTitle>
  );
};
export default PageHeader;

PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
