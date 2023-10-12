/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FeedBackButton from './FeedbackButton/FeedbackButton';
import FeedbackForm from './FeedbackForm/FeedbackForm';
import { AppContext } from '../../providers/AppProvider';

const isEmpty = (str) => !str.trim().length;

const handleCustomPosition = (position, formStyles) => {
  let customFormStyles;
  if (position === 'left') {
    customFormStyles = { ...formStyles, left: '5%' };
  } else {
    customFormStyles = { ...formStyles, right: '3%' };
  }
  return customFormStyles;
};

const questions = [
  {
    id: 1,
    display: 'I like something',
    title: 'What did you like?',
    subTitle: 'Help us improve by giving us more detail.',
  },
  {
    id: 2,
    display: 'I have an idea',
    title: 'What is your suggestion?',
    subTitle: 'Give us more details about it.',
  },
  {
    id: 3,
    display: "Something's not working",
    title: 'What did you find?',
    subTitle: 'Give us more details so we can look into it.',
  },
];

const Feedback = (props) => {
  const [showButton, setShowButton] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selQuestion, setSelQuestion] = useState(undefined);
  const { user }=useContext(AppContext);
  const initialState = {
    value: '',
    email: user?.email || '',
  };

  const {
    headerText,
    buttonText,
    position,
    buttonStyles,
    headerStyles,
    headerBtnStyles,
    headerBtnText,
    bodyText,
    style,
    handleClose,
    handleButtonClick,
    handleSubmit,
    isSubmissionSuccess,
  } = props;

  useEffect(() => {
    if (isSubmissionSuccess !== undefined) {
      setSelQuestion(undefined);
      feedbackFromik.resetForm();
    }
  }, [isSubmissionSuccess]);

  const submithandler = (values) => {
    if (isEmpty(values.value) || isEmpty(values.email)) {
      alert('Fields are missing!');
    } else {
      handleSubmit({
        message: values.value,
        email: values.email,
        proxy: 'hackshack',
      });
    }
  };

  const successClose = () => {
    handleClose();
    setShowForm(false);
    setShowButton(true);
  };

  const validationSchema = yup.object({
    value: yup.string().required('Required'),
    email: yup.string().email('Invalid email format'),
  });

  const feedbackFromik = useFormik({
    initialValues: initialState,
    onSubmit: submithandler,
    validationSchema,
  });

  const buttonClickHandler = () => {
    setShowButton(false);
    setShowForm(true);
    handleButtonClick();
  };
  const nextHandler = () => {
    if (!selQuestion) {
      setSelQuestion(questions[0]);
    }
  };

  const changeQuestion = (value) => {
    setSelQuestion(questions[value]);
  };

  const closeHandler = () => {
    setShowButton(true);
    setSelQuestion(undefined);
    feedbackFromik.resetForm();
    setShowForm(false);
    handleClose();
  };

  const cancelQuestion = () => {
    setSelQuestion(undefined);
    feedbackFromik.resetForm();
  };

  return (
    <Box>
      {showForm && (
        <Box>
          <FeedbackForm
            style={style}
            headerText={headerText}
            position={position}
            headerStyles={headerStyles}
            headerBtnStyles={headerBtnStyles}
            headerBtnText={headerBtnText}
            handleClose={closeHandler}
            bodyText={bodyText}
            feedbackFromik={feedbackFromik}
            selQuestion={selQuestion}
            handleCustomPosition={handleCustomPosition}
            changeQuestion={changeQuestion}
            nextHandler={nextHandler}
            questions={questions}
            cancelQuestion={cancelQuestion}
            successClose={successClose}
            isSubmissionSuccess={isSubmissionSuccess}
          />
        </Box>
      )}
      {showButton && (
        <FeedBackButton
          position={position}
          styles={buttonStyles}
          text={buttonText}
          handleButtonClick={buttonClickHandler}
          handleCustomPosition={handleCustomPosition}
        />
      )}
    </Box>
  );
};

Feedback.propTypes = {
  headerText: PropTypes.string,
  bodyText: PropTypes.string,
  position: PropTypes.string,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleButtonClick: PropTypes.func,
  buttonStyles: PropTypes.object,
  headerStyles: PropTypes.object,
  headerBtnStyles: PropTypes.object,
  buttonText: PropTypes.string,
  headerBtnText: PropTypes.string,
};

Feedback.defaultProps = {
  position: 'right',
  handleSubmit: () => {},
  handleClose: () => {},
  handleButtonClick: () => {},
};

export default Feedback;
