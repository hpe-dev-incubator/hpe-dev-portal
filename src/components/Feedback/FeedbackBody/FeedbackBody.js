/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { Box, Button, TextInput, Text } from 'grommet';
import React, { useState } from 'react';
import { Dislike, Like, Emoji } from 'grommet-icons';

const defaultBodyStyles = {
  padding: '10px',
  fontSize: '14px',
  display: 'block !important',
};

const defaultMessageStyles = {
  boxSizing: 'border-box',
  padding: '10px 10px 10px 10px',
  overflow: 'hidden',
  width: '300px',
  fontFamily: 'arial',
};

const FeedbackBody = ({
  bodyText,
  feedbackFromik,
  selQuestion,
  changeQuestion,
}) => {
  const [emailDis, setEmailDis] = useState(false);

  return (
    <Box gap="small" style={{ height: 300, width: 300 }}>
      {selQuestion === undefined && (
        <Box style={{ marginBottom: 60 }}>
          <Box style={defaultMessageStyles}>
            <Text weight="bold">{bodyText}</Text>
          </Box>
          <Button
            alignSelf="center"
            secondary
            label="I like something"
            icon={<Like />}
            style={{ marginTop: 10 }}
            onClick={() => changeQuestion(0)}
          />
          <Button
            alignSelf="center"
            secondary
            label="I have an idea"
            icon={<Emoji />}
            style={{ marginTop: 10 }}
            onClick={() => changeQuestion(1)}
          />
          <Button
            alignSelf="center"
            secondary
            label="Something's not working"
            icon={<Dislike />}
            style={{ marginTop: 10 }}
            onClick={() => changeQuestion(2)}
          />
        </Box>
      )}

      {selQuestion && !emailDis && (
        <Box style={{ marginInline: 20, marginTop: 40 }}>
          <Text weight="bold">{selQuestion.title}</Text>
          <TextInput
            rows="5"
            name="value"
            value={feedbackFromik.values.value}
            placeholder="Enter Your Name"
            required
            style={{ marginTop: 20 }}
            onChange={feedbackFromik.handleChange}
          />
          <Button
            label="Next"
            style={{ marginTop: 20 }}
            onClick={() => setEmailDis(true)}
            alignSelf="end"
            primary
          />
        </Box>
      )}

      {selQuestion && emailDis && (
        <Box style={{ marginInline: 20, marginTop: 40 }}>
          <Text weight="bold">Can we get back to you?</Text>
          <TextInput
            name="email"
            rows="5"
            value={feedbackFromik.values.email}
            style={{ marginTop: 20 }}
            placeholder="Enter Your Email"
            required
            onChange={feedbackFromik.handleChange}
          />
          <Button
            label="Submit"
            style={{ marginTop: 20 }}
            onClick={() => feedbackFromik.submitForm()}
            alignSelf="end"
            primary
          />
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
