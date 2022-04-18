/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from 'grommet';
import FeedbackHeader from '../FeedbackHeader/FeedbackHeader';
import FeedbackBody from '../FeedbackBody/FeedbackBody';

const formStyles = {
  position: 'fixed',
  backgroundColor: '#FAFAFA',
  border: '1px solid #dcdcdc',
  borderRadius: '6px 6px 0 0',
  zIndex: '50000',
  bottom: '0px',
  height: 'auto',
  width: 'auto',
};

const FeedbackForm = (props) => {
  const {
    headerStyles,
    headerText,
    position,
    handleClose,
    handleCustomPosition,
    bodyText,
    nextHandler,
    feedbackFromik,
    ansQuestion,
    changeAnsQue,
    selQuestion,
    changeQuestion,
    cancelQuestion,
    successClose,
  } = props;

  const customFormStyles = handleCustomPosition(position, formStyles);
  return (
    <Card
      height="small"
      width="small"
      background="light-1"
      style={customFormStyles}
    >
      <FeedbackHeader
        styles={headerStyles}
        headerText={headerText}
        handleClose={handleClose}
      />
      <FeedbackBody
        bodyText={bodyText}
        feedbackFromik={feedbackFromik}
        ansQuestion={ansQuestion}
        nextHandler={nextHandler}
        changeAnsQue={changeAnsQue}
        selQuestion={selQuestion}
        changeQuestion={changeQuestion}
        cancelQuestion={cancelQuestion}
        successClose={successClose}
      />
      {/* <FeedbackFooter handleSubmit={handleSubmit} 
      handleClose={handleClose} /> */}
    </Card>
  );
};

export default FeedbackForm;
