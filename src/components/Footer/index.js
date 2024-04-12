/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { Box, Heading, Anchor } from 'grommet';
import axios from 'axios';
import { EmailCapture } from '../../containers';
import Feedback from '../Feedback/index';
import AuthService from '../../services/auth.service';
// import { AppContext } from '../../providers/AppProvider';

export const Footer = () => {
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(undefined);
  const sendEmail = (data) => {
    axios({
      method: 'POST',
      url: `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/email/send-feedback`,
      headers: {
        'x-access-token': AuthService.getCurrentUser().accessToken,
      },
      data: {
        message: data.message,
        email: data.email,
        proxy: 'hackshack',
      },
    })
      .then((response) => {
        setIsSubmissionSuccess(true);
        console.log('response', response);
        if (response?.data?.status === 200) {
          console.log('success');
        } else {
          console.log('failure');
        }
      })
      .catch((err) => {
        setIsSubmissionSuccess(false);
        if (err.response) {
          if (err.response.status === 401) {
            AuthService.login().then(() => sendEmail());
          } else {
            console.log('err', err);
          }
        }
      });
  };
  return (
    <div>
      <Box
        direction="row-responsive"
        border={{ side: 'top', size: 'small' }}
        justify="between"
        margin={{ horizontal: 'medium' }}
        pad={{ vertical: 'large', horizontal: 'medium' }}
        flex={false}
        gap="xlarge"
      >
        <Box>
          <EmailCapture bodyCopy2 />
        </Box>
        <Box flex={false} direction="row" justify="between" gap="large">
          <Box align="start" gap="medium">
            <Heading margin="none" level="4">
              HPE Developer
            </Heading>
            <Box gap="small">
              <Anchor
                align="start"
                href="https://developer.hpe.com/slack-signup"
                label="Slack"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="https://twitter.com/HPE_Developer"
                label="X"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="https://www.youtube.com/playlist?list=PLtS6YX0YOX4f5TyRI7jUdjm7D9H4laNlF"
                label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="mailto:hpedev@hpe.com?
            subject=HPE%20DEV%20Portal%20-%20Contact%20Us"
                label="Contact Us"
                target="_blank"
                rel="noopener noreferrer"
              />
            </Box>
          </Box>
          <Box align="start" gap="medium">
            <Heading margin="none" level="4">
              About HPE
            </Heading>
            <Box gap="small">
              <Anchor
                align="start"
                href="https://www.hpe.com/"
                label="HPE.com"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="https://www.hpe.com/us/en/about/jobs.html"
                label="HPE Careers"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="https://community.hpe.com/"
                label="HPE Community"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Anchor
                align="start"
                href="https://github.com/hewlettpackard/"
                label="HPE GitHub"
                target="_blank"
                rel="noopener noreferrer"
              />
            </Box>
          </Box>
        </Box>
      </Box>
        <Feedback
        style={{ zIndex: '100', position: 'fixed', left: '2px!' }}
        position="right"
        headerText="Help us improve the Community"
        bodyText="What kind of feedback do you have?"
        buttonText="Feedback"
        handleClose={() => setIsSubmissionSuccess(undefined)}
        isSubmissionSuccess={isSubmissionSuccess}
        handleSubmit={(data) => {
          sendEmail(data);
        }}
        handleButtonClick={() => console.log('handleButtonClick')}
      />
    </div>
  );
};
export default Footer;
