import React from 'react';
import { Anchor, Heading, Text } from 'grommet';

export const Questions = () => (
  <>
    <Heading level="3"> Questions? </Heading>
    <Text size="27px" margin={{ bottom: 'medium' }}>
      Feel free to reach out to us via{' '}
      <Anchor href="mailto:hpedev@hpe.com" target="_blank">
        email
      </Anchor>{' '}
      or through our{' '}
      <Anchor href="https://slack.hpedev.io/" target="_blank">
        HPE Developer Slack channel
      </Anchor>
      .
    </Text>
  </>
);

export default Questions;
