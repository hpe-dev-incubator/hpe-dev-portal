/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Button } from 'grommet';

const defaultButtonStyles = {
  position: 'absolute',
  fontSize: '20px',
  right: '15px',
  color: '#ffffff',
  background: 'none',
  border: 0,
  fontWeight: 'bold',
  lineHeight: '40px',
  height: '40px',
};

const defaultHeaderStyles = {
  lineHeight: '40px',
  paddingLeft: '15px',
  height: '40px',
  borderRadius: '6px 6px 0 0',
  backgroundColor: '#263040',
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: '500',
  overflow: 'hidden',
};

const FeedbackHeader = ({
  headerText,
  headerBtnText,
  handleClose,
  headerStyles,
  headerBtnStyles,
}) => (
  <Box style={headerStyles}>
    {headerText}
    <Button onClick={handleClose} style={headerBtnStyles} type="button">
      {headerBtnText}
    </Button>
  </Box>
);

FeedbackHeader.defaultProps = {
  headerText: 'Have Feedback? 📝',
  headerBtnText: 'X',
  headerBtnStyles: defaultButtonStyles,
  headerStyles: defaultHeaderStyles,
};

export default FeedbackHeader;
