import React from 'react';
import PropTypes from 'prop-types';

import { Anchor, Box, Text } from 'grommet';
import { Facebook, Linkedin, Twitter } from 'grommet-icons';

export const Share = ({ url, text }) => (
  <Box gap="small" justify="center">
    <Text size="large">Share</Text>
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      a11yTitle="Share on Twitter"
      href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
    >
      <Box direction="row" align="center" gap="small">
        <Twitter size="medium" />
        <Text>Twitter</Text>
      </Box>
    </Anchor>
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      a11yTitle="Share on Facebook"
      href={`https://www.facebook.com/dialog/share?app_id=199460010977271&display=popup&href=${url}`}
    >
      <Box direction="row" align="center" gap="small">
        <Facebook size="medium" />
        <Text>Facebook</Text>
      </Box>
    </Anchor>
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      a11yTitle="Share on LinkedIn"
      href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
    >
      <Box direction="row" align="center" gap="small">
        <Linkedin size="medium" />
        <Text>LinkedIn</Text>
      </Box>
    </Anchor>
  </Box>
);

Share.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};
export default Share;
