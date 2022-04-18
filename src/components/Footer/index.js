/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Box, Heading, Anchor } from 'grommet';
import { EmailCapture } from '../../containers';
import Feedback from '../Feedback/index';

export const Footer = () => (
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
            HPE DEV
          </Heading>
          <Box gap="small">
            <Anchor
              align="start"
              href="https://slack.hpedev.io/"
              label="Slack Channel"
              target="_blank"
              rel="noopener noreferrer"
            />
            <Anchor
              align="start"
              href="https://twitter.com/HPE_DevCom"
              label="Twitter"
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
      position="left"
      numberOfStars={5}
      headerText="Help us improve HPE DEV Community"
      bodyText="What kind of Feedback do you have?"
      buttonText="Feedback"
      handleClose={() => console.log('handleclose')}
      handleSubmit={(data) => console.log(JSON.stringify(data))}
      handleButtonClick={() => console.log('handleButtonClick')}
    />
  </div>
);

export default Footer;
