import React, { useState } from 'react';
import {
  Box,
  Heading,
  Anchor,
  Paragraph,
  Text,
  Form,
  FormField,
  TextInput,
  Button,
} from 'grommet';

const emailValidation = [
  {
    regexp: new RegExp('[^@ \\t\\r\\n]+@'),
    message: 'Enter a valid email address.',
    status: 'error',
  },
  {
    regexp: new RegExp('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+'),
    message: 'Enter a valid email address.',
    status: 'error',
  },
  {
    regexp: new RegExp('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+'),
    message: 'Enter a valid email address.',
    status: 'error',
  },
];

export const EmailCapture = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
  });

  const onSubmit = ({ data, touched }) => {
    // eslint-disable-line
    setSucceeded(false);
    setError('');
    //  fetch(`https://api.sendgrid.com/v3/contactdb/lists/${list_id}/recipients/${recipient_id}`, {
    //   method: 'POST',
    //   headers: new Headers({ // eslint-disable-line
    //     'Content-Type': 'application/json'
    //   }),
    //   body: JSON.stringify( data.emailAddress, listId )
    // })
    //   .then(response =>
    //     response.json().then(json => ({
    //       status: response.status,
    //       statusText: response.statusText,
    //       json,
    //     })),
    //   )
    //   .then(({ status, json }) => {
    //     if (status >= 400) {
    //       setError(json.error ||
    //                  'There was an error processing your request.');
    //       setSucceeded(false)
    //     }

    //       setSucceeded(true);
    //   });
  };

  const resetForm = () => {
    setFormData({
      email: '',
    });
  };

  return (
    <Box align="start" gap="medium">
      <Box>
        <Heading margin="none" level="4" align="start">
          HPE Developer Newsletter
        </Heading>
      </Box>
      <Box>
        <Text>Stay in the loop.</Text>
        <Text style={{ marginTop: 0 }}>
          Sign up for the HPE Developer Newsletter or visit the{' '}
          <Anchor label="Newsletter Archive" href="/newsletter-archive" /> to
          see past content.
        </Text>
      </Box>
      <Box>
        <Form
          validate="blur"
          value={formData}
          onChange={setFormData}
          onSubmit={({ value, touched }) => onSubmit({ value, touched })}
        >
          <FormField
            name="email"
            label="Email Address"
            required
            width="medium"
            validate={emailValidation}
          >
            <TextInput placeholder="example@my.com" name="email" />
          </FormField>
          <Box margin={{ top: 'medium' }} gap="medium">
            <Text>
              By clicking on “Subscribe Now”, you confirm that you have read and
              agreed to the Terms & Conditions of{' '}
              <Anchor
                label="HPE's Privacy Policy"
                href="https://www.hpe.com/us/en/legal/privacy.html"
                target="_blank"
                rel="noreferrer noopener"
              />
              .
            </Text>
            <Button
              alignSelf="start"
              label="Subscribe Now"
              secondary
              type="submit"
            />
            {error && (
              <Paragraph size="large" margin="none">
                {error && 'Unable to subscribe to the newsletter.Try again!'}
              </Paragraph>
            )}
          </Box>
        </Form>
      </Box>
      {succeeded && (
        <Box>
          <Paragraph size="large" margin="none">
            Thanks! You are subscribed to the newsletter.
          </Paragraph>
          <Paragraph size="large" margin="none">
            <Anchor onClick={resetForm}>Reset entry form</Anchor>
          </Paragraph>
        </Box>
      )}
    </Box>
  );
};

export default EmailCapture;
