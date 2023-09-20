import React, { useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  Anchor,
  Text,
  Form,
  FormField,
  TextInput,
  Button,
  Paragraph,
} from 'grommet';

import { Link } from '../../components';
import { AppContext } from '../../providers/AppProvider';

const { GATSBY_NEWSLETTER_API } = process.env;

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

export const EmailCapture = ({ children, heading, bodyCopy1, bodyCopy2 }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user: userDetails } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: userDetails?.email || '',
  });

  const onSubmit = () => {
    // eslint-disable-line
    setErrorMsg('');
    const { email } = formData;
    const listId = 14530343;
    return fetch(GATSBY_NEWSLETTER_API, {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({ email, listId }),
      json: true,
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.error_count !== 0) {
          setLoading(false);
          setErrorMsg('There was an error processing your request.');
        }
        if (res.new_count === 1) {
          setLoading(false);
          setSuccess(true);
        }
        if (res.new_count === 0) {
          setErrorMsg('You have already signed up for our newsletter.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetForm = () => {
    setFormData({
      email: '',
    });
  };

  return (
    <Box align="start" gap="medium">
      {!children && (
        <Box>
          <Box size="large">
            <Heading margin="none">{heading}</Heading>
          </Box>
          <Box>
            <Paragraph margin="none">{bodyCopy1}</Paragraph>
            {bodyCopy2 && (
              <Text>
                Sign up for the HPE Developer Newsletter or visit the{' '}
                <Link to="/newsletter-archive">Newsletter Archive</Link> to see
                past content.
              </Text>
            )}
          </Box>
        </Box>
      )}
      <Box>
        <Form
          validate="blur"
          value={formData}
          onChange={setFormData}
          onSubmit={() => onSubmit()}
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
            <Paragraph margin="none">
              By clicking on “Subscribe Now”, I agree to HPE sending me
              personalized email communication about HPE and select HPE-Partner
              products, services, offers and events. I understand that my email
              address will be used in accordance with{' '}
              <Anchor
                label="HPE Privacy Statement"
                href="https://www.hpe.com/us/en/legal/privacy.html"
                target="_blank"
                rel="noreferrer noopener"
              />
              . You may unsubscribe from receiving HPE and HPE-Partner news and
              offers at any time by clicking on the Unsubscribe button at the
              bottom of the newsletter.
            </Paragraph>
            <Button
              alignSelf="start"
              label="Subscribe Now"
              primary
              type="submit"
            />
            <Paragraph margin="none">
              For more information on how HPE manages, uses, and protects your
              personal data please refer to{' '}
              <Anchor
                label="HPE Privacy Statement"
                href="https://www.hpe.com/us/en/legal/privacy.html"
                target="_blank"
                rel="noreferrer noopener"
              />
              .
            </Paragraph>
            {errorMsg && <Text color="status-critical">{errorMsg}</Text>}
          </Box>
        </Form>
      </Box>
      {loading && (
        <Box>
          <Text>Loading...</Text>
        </Box>
      )}
      {success && (
        <Box>
          <Text>Thanks! You are subscribed to the newsletter.</Text>
          <Text>
            <Anchor onClick={resetForm}>Reset entry form</Anchor>
          </Text>
        </Box>
      )}
    </Box>
  );
};

EmailCapture.defaultProps = {
  heading: 'HPE Developer Newsletter',
  bodyCopy1: 'Stay in the loop.',
};

EmailCapture.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  bodyCopy1: PropTypes.string,
  bodyCopy2: PropTypes.bool,
};

export default EmailCapture;
