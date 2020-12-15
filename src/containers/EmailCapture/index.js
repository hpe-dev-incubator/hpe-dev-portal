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

export const EmailCapture = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
  });

  const isValidEmail = (email) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return emailRegex.test(email);
  };

  const onSubmit = () => {
    // eslint-disable-line
    if (isValidEmail(formData.email)) {
      setEmailError('');
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
    } else {
      setEmailError('Email is not valid');
    }
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
      <Box align="start">
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
          onSubmit={({ value }) => onSubmit({ value })}
        >
          <FormField
            name="email"
            label="Email Address"
            error={emailError}
            required
            width="medium"
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
                {error && 'There was an error storing your email.'}
              </Paragraph>
            )}
          </Box>
        </Form>
      </Box>
      {succeeded && (
        <Box pad={{ between: 'medium' }}>
          <Paragraph size="large" margin="none">
            Thanks! We have successfully stored your email address.
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
