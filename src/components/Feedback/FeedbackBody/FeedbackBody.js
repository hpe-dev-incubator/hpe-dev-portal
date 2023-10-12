/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { Box, Button, TextInput, Text, TextArea, Image } from 'grommet';
import React, { useState } from 'react';
import { FormNextLink, FormPreviousLink } from 'grommet-icons';

const defaultBodyStyles = {
  padding: '10px',
  fontSize: '14px',
  display: 'block !important',
};

const defaultMessageStyles = {
  boxSizing: 'border-box',
  padding: '10px 10px 10px 10px',
  overflow: 'hidden',
  // width: '300px',
  fontFamily: 'arial',
};

const FeedbackBody = ({
  bodyText,
  feedbackFromik,
  selQuestion,
  changeQuestion,
  cancelQuestion,
  successClose,
  isSubmissionSuccess,
}) => {
  const [emailDis, setEmailDis] = useState(false);
  const backHandler = () => {
    if (emailDis) {
      setEmailDis(false);
    } else {
      feedbackFromik.resetForm();
      cancelQuestion();
    }
  };
  return (
    <Box gap="small" style={{ height: 300, width: 350 }}>
      {selQuestion === undefined &&
        (isSubmissionSuccess === undefined ? (
          <Box style={{ marginBottom: 60 }}>
            <Box style={defaultMessageStyles}>
              <Text weight="bold" alignSelf="center">
                {bodyText}
              </Text>
            </Box>
            <Button
              alignSelf="center"
              secondary
              style={{ marginTop: 10, padding: 0, paddingInline: 10 }}
              onClick={() => changeQuestion(0)}
            >
              {() => (
                <Box
                  pad="small"
                  direction="row"
                  align="center"
                  gap="small"
                  style={{ padding: 7 }}
                >
                  <Image
                    src="/img/home/like.png"
                    alt="I like something"
                    style={{ height: 22, width: 22 }}
                  />
                  <Text>I like something</Text>
                </Box>
              )}
            </Button>

            <Button
              alignSelf="center"
              secondary
              style={{ marginTop: 10, padding: 0, paddingInline: 10 }}
              onClick={() => changeQuestion(1)}
            >
              {() => (
                <Box
                  pad="small"
                  direction="row"
                  align="center"
                  gap="small"
                  style={{ padding: 7 }}
                >
                  <Image
                    src="/img/home/idea.png"
                    alt="I have an idea"
                    style={{ height: 24, width: 24 }}
                  />
                  <Text>I have an idea</Text>
                </Box>
              )}
            </Button>
            <Button
              alignSelf="center"
              secondary
              style={{ marginTop: 10, padding: 0, paddingInline: 10 }}
              onClick={() => changeQuestion(2)}
            >
              {() => (
                <Box
                  pad="small"
                  direction="row"
                  align="center"
                  gap="small"
                  style={{ padding: 7 }}
                >
                  <Image
                    src="/img/home/something-wrong.png"
                    alt="Something's not working"
                    style={{ height: 24, width: 24 }}
                  />
                  <Text>Something's not working</Text>
                </Box>
              )}
            </Button>
          </Box>
        ) : (
          <Box style={{ marginBottom: 60, marginInline: 20 }}>
            {isSubmissionSuccess === true ? (
              <>
                <Image
                  height={60}
                  width={60}
                  alignSelf="center"
                  src="https://pbs.twimg.com/profile_images/1060682187232600065/SotJzj_4_400x400.jpg"
                  style={{ marginTop: 20 }}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 25,
                    fontSize: 22,
                  }}
                >
                  Thank You!
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '500',
                  }}
                >
                  We value your feedback and we will use it to improve our
                  websites and services.
                </Text>

                <Button
                  label="Close"
                  style={{ marginTop: 30 }}
                  onClick={() => {
                    successClose();
                  }}
                  alignSelf="center"
                  primary
                />
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                  Please try again later
                </div>
                <Button
                  label="Close"
                  style={{ marginTop: 30 }}
                  onClick={() => {
                    successClose();
                  }}
                  alignSelf="center"
                  primary
                />
              </>
            )}
          </Box>
        ))}

      {selQuestion && (
        <Box style={{ marginInline: 20, marginTop: 20, marginBottom: 20 }}>
          <Box style={{ marginBottom: 20 }} onClick={() => backHandler()}>
            <FormPreviousLink />
          </Box>
          {!emailDis ? (
            <>
              <Text weight="bold">{selQuestion.title}</Text>
              <Text style={{ fontSize: 14 }}>{selQuestion.subTitle}</Text>
              <TextArea
                rows="5"
                name="value"
                value={feedbackFromik.values.value}
                placeholder="Type here..."
                required
                style={{ marginTop: 10 }}
                onChange={(val) => {
                  feedbackFromik.handleChange(val);
                }}
                onBlur={feedbackFromik.handleBlur}
                onSubmit={() => {}}
              />
              {feedbackFromik.errors.value && (
                <Text style={{ fontSize: 14 }}>
                  {feedbackFromik.errors.value}
                </Text>
              )}
              <Button
                label="Next"
                style={{ marginTop: 20 }}
                icon={<FormNextLink />}
                onClick={() => setEmailDis(true)}
                alignSelf="end"
                reverse
                primary
                disabled={
                  feedbackFromik.values.value === '' ||
                  feedbackFromik.errors.value
                }
              />
            </>
          ) : (
            <>
              <Text weight="bold">Can we get back to you?</Text>
              <Text style={{ fontSize: 14 }}>
                If yes, please share your email
              </Text>
              <TextInput
                name="email"
                rows="5"
                value={feedbackFromik.values.email}
                style={{ marginTop: 10 }}
                placeholder="Enter Your Email"
                onChange={(val)=>{feedbackFromik.handleChange(val);
                }}
                onBlur={feedbackFromik.handleBlur}
              />
              {feedbackFromik.errors.email && (
                <Text style={{ fontSize: 14 }}>
                  {feedbackFromik.errors.email}
                </Text>
              )}
              <Button
                label="Send Feedback"
                style={{ marginTop: 20 }}
                onClick={() => {
                  feedbackFromik.submitForm();
                }}
                alignSelf="end"
                primary
                disabled={!!feedbackFromik.errors.email}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

FeedbackBody.defaultProps = {
  bodyText:
    "Need help? Have feedback? I'm a human so please be nice and I'll fix it!",
  bodyStyles: defaultBodyStyles,
  showEmailInput: true,
  showMessageInput: true,
  showNameInput: true,
  numberOfStars: 5,
};

export default FeedbackBody;
