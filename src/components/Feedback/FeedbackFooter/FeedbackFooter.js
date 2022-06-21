/* eslint-disable react/prop-types */
import { Box, Button } from 'grommet';
import React from 'react';

const defaultFooterStyles = {
  height: '50px',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const FeedbackFooter = ({ handleSubmit, footerStyles, handleClose }) => {
  return (
    <Box style={footerStyles}>
      <Box direction="row" justify="between">
        <Button onClick={handleSubmit} secondary label="Submit" />
        <Button onClick={handleClose} secondary label="Close" />
      </Box>
    </Box>
  );
};

FeedbackFooter.defaultProps = {
  footerStyles: defaultFooterStyles,
};

export default FeedbackFooter;
