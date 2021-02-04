import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button } from 'grommet';
import { Linkedin, Twitter, Link } from 'grommet-icons';

export const Share = ({ url, text }) => {
  const [toolTip, setToolTip] = useState('Click to copy the URL to clipboard');
  return (
    <Box gap="small" direction="row" justify="start">
      <Button
        target="_blank"
        rel="noopener noreferrer"
        a11yTitle="Share on Twitter"
        href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
        icon={<Twitter />}
      />
      <Button
        target="_blank"
        rel="noopener noreferrer"
        a11yTitle="Share on LinkedIn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        icon={<Linkedin />}
      />
      <Button
        icon={<Link />}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setToolTip('Copied!');
        }}
        tip={{
          dropProps: { align: { left: 'right' } },
          content: toolTip,
        }}
      />
    </Box>
  );
};

Share.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};
export default Share;
