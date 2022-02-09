import React, { useState } from 'react';
import { Linkedin, Twitter, Link as GrommetLink } from 'grommet-icons';
import { Button } from 'grommet';
import PropTypes from 'prop-types';

const Share = ({ replayId, workshop }) => {
  const [toolTip, setToolTip] = useState('Click to copy the URL to clipboard');
  const { origin } = window.location;

  return (
    <>
      <Button
        icon={<Linkedin size="medium" />}
        target="_blank"
        rel="noopener noreferrer"
        a11yTitle="Share on LinkedIn"
        label={workshop && 'LinkedIn'}
        reverse
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${origin}/workshop/${replayId}`}
      />
      <Button
        margin={{ horizontal: '20px' }}
        icon={<Twitter size="medium" />}
        target="_blank"
        rel="noopener noreferrer"
        a11yTitle="Share on Twitter"
        label={workshop && 'Twitter'}
        reverse
        href={`https://twitter.com/intent/tweet?url=${origin}/workshop/${replayId}`}
      />
      <Button
        icon={<GrommetLink size="medium" />}
        onClick={() => {
          /* eslint-disable no-unused-expressions */
          workshop
            ? navigator.clipboard.writeText(
                `${origin}/hackshack/workshop/${replayId}`,
              )
            : navigator.clipboard.writeText(window.location.href);
          /* eslint-enable no-unused-expressions */
          setToolTip('Copied!');
        }}
        tip={{
          dropProps: { align: { bottom: 'top' } },
          content: toolTip,
        }}
        label={workshop && 'Copy'}
        reverse
      />
    </>
  );
};

Share.propTypes = {
  replayId: PropTypes.number,
  workshop: PropTypes.bool,
};

export default Share;
