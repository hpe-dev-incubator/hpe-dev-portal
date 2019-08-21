import React from 'react';
import { Anchor, Box } from 'grommet';
import { Slack, Github, Twitter } from 'grommet-icons';

export const SocialMedia = () => (
  <Box direction="row" gap="xxsmall" justify="center">
    <Anchor
      target="_blank"
      a11yTitle="Follow us on Twitter"
      href="https://twitter.com/"
      icon={<Twitter color="dark-3" size="medium" />}
    />
    <Anchor
      target="_blank"
      a11yTitle="Share feedback on Github"
      href="https://www.github.com/"
      icon={<Github color="dark-3" size="medium" />}
    />
    <Anchor
      target="_blank"
      a11yTitle="Chat with us on Slack"
      href="https://www.slack.com/"
      icon={<Slack color="dark-3" size="medium" />}
    />
  </Box>
);

export default SocialMedia;
