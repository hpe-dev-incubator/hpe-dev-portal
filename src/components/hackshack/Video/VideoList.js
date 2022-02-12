import React from 'react';
import ReactPlayer from 'react-player';
import { Box, Button, Heading, Text } from 'grommet';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

const VideoList = ({
  desc,
  id,
  presenter,
  role,
  videoLink,
  title,
  setCurrent,
  setAutoPlay,
}) => {
  return (
    <Link to={`/hackshack/replays/${id}`}>
      <Button
        onClick={() => {
          setCurrent(id);
          setAutoPlay(true);
        }}
        style={{ textAlign: 'start' }}
      >
        <Box gap="large" direction="row-responsive">
          <ReactPlayer
            url={videoLink}
            style={{
              maxWidth: '280px',
              minWidth: '280px',
              width: '280px',
              maxHeight: '180px',
              height: '180px',
              zIndex: -10,
            }}
          />

          <Box direction="column">
            <Box>
              <Text color="white">{presenter}</Text>
              <Text color="white">{role}</Text>
            </Box>
            <Heading
              color="text-strong"
              margin={{ top: '0px', bottom: 'small' }}
              level={3}
            >
              {title}
            </Heading>
            <Box>
              <Text
                color="text-strong"
                margin={{ bottom: 'large' }}
                weight={100}
                size="22px"
              >
                {desc}
              </Text>
            </Box>
          </Box>
        </Box>
      </Button>
    </Link>
  );
};

VideoList.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  desc: PropTypes.string,
  role: PropTypes.string,
  videoLink: PropTypes.string,
  presenter: PropTypes.string,
  setCurrent: PropTypes.func,
  setAutoPlay: PropTypes.func,
};

export default VideoList;
