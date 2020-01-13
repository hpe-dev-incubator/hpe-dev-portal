import React, { useState } from 'react';
import { Box, Heading, Text, Form, Button, TextInput, CheckBox } from 'grommet';

import { Layout, SEO } from '../../components';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [optIn, setOptin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = e => {
    setErrorMsg('');
    setEmail(e.target.value);
  };

  const isValidEmail = () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email) {
      setErrorMsg('Email field cannot be empty');
      return false;
    }
    if (email && !isValidEmail(email)) {
      setErrorMsg('Must be a valid email');
      return false;
    }
    if (!optIn) {
      setErrorMsg('Opt in required');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const onSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      return fetch('https://api.sendgrid.com/v3/contactdb/recipients', {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        }),
        body: JSON.stringify([
          {
            email,
          },
        ]),
        json: true,
      })
        .then(res => res.json())
        .then(res => {
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
        .catch(err => {
          console.log(err);
        });
    }
    return false;
  };

  const handleForm = () => {
    if (loading) {
      return <Text>loading...</Text>;
    }
    if (success) {
      return <Text>You have successfully signed up for our newsletter!</Text>;
    }
    return (
      <Form onSubmit={e => onSubmit(e)}>
        <TextInput
          placeHolder="Email Address"
          value={email}
          onChange={e => onChange(e)}
        />
        <Box margin={{ top: 'large' }}>
          <CheckBox
            checked={optIn}
            onChange={() => setOptin(!optIn)}
            label="May HPE provide you with personalized email communications about HPE and select HPE-partner products, services, offers and events?" // eslint-disable-line
          />
        </Box>
        <Box margin={{ top: 'medium', bottom: 'medium' }} align="start">
          <Button type="submit">Submit</Button>
        </Box>
        {errorMsg && <Text color="status-critical">{errorMsg}</Text>}
      </Form>
    );
  };

  return (
    <Layout title="Newsletter Signup">
      <SEO title="Newsletter-Signup" />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box pad={{ vertical: 'large', horizontal: 'large' }} width="xlarge">
          <Heading size="large">
            Sign up for the HPE Developer Newsletter
          </Heading>
          <Text size="xlarge" margin={{ bottom: 'large' }}>
            Sign up and be the first to know about our development platforms,
            news, and project information as it becomes available.
          </Text>
          <Text size="xlarge" margin={{ bottom: 'large' }}>
            View the Newsletter Archive to see past content.
          </Text>
          <Box width="medium">{handleForm()}</Box>
        </Box>
      </Box>
    </Layout>
  );
}

export default NewsletterSignup;
