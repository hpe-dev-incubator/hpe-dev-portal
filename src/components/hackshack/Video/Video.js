import React, { useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import { Box, Text, Avatar, ResponsiveContext, Button } from 'grommet';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { SignupLayer, SuccessLayer } from '../Card/ScheduleCard';
import Share from '../Share';

const Video = ({
  videolink,
  avatar,
  desc,
  presenter,
  role,
  title,
  id,
  setCurrent,
  current,
  replaysLength,
  autoplay,
  notebook,
  sessionType,
  location,
  capacity,
  workshopTitle,
  workshopId,
  workshopDuration,
}) => {
  console.log('workshop duration', workshopDuration);
  console.log('capacity', capacity);
  const [signupLayer, setSignupLayer] = useState(false);
  const [successLayer, setSuccessLayer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: workshopTitle,
    notebook,
    sessionType,
    location,
    termsAndConditions: false,
    proxy: 'hackshack',
  });
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      title: workshopTitle,
      notebook,
      sessionType,
      location,
      termsAndConditions: false,
      proxy: 'hackshack',
    });
  };
  const size = useContext(ResponsiveContext);
  const optionsLarge = { width: '640px', height: '380px' };
  const optionsSmall = {
    maxWidth: '280px',
    minWidth: '280px',
    width: '280px',
    maxHeight: '180px',
    height: '180px',
  };
  return (
    <Box>
      <ReactPlayer
        controls
        url={videolink}
        playing={autoplay}
        style={size === 'small' ? optionsSmall : optionsLarge}
        onEnded={() => {
          if (current >= replaysLength - 1) {
            setCurrent(0);
          } else {
            setCurrent(id + 1);
          }
        }}
      />
      <Box fill="horizontal" border={{ side: 'bottom' }}>
        <Box direction="column">
          <Box direction="column">
            <Box
              direction={size === 'small' ? 'column' : 'row'}
              justify="between"
              margin={{ vertical: 'medium' }}
              width={size === 'small' ? '100%' : '640px'}
            >
              {notebook && sessionType && location && (
                <Box width={capacity === 0 ? '350px' : '110px'}>
                  <Button
                    size="small"
                    onClick={() => setSignupLayer(true)}
                    margin={{ vertical: size === 'large' ? '0px' : 'small' }}
                    disabled={capacity === 0}
                    label={
                      <Text color="text-strong" size="large">
                        {capacity === 0
                          ? 'Currently full, please try again later'
                          : 'Register'}
                      </Text>
                    }
                    primary
                  />
                </Box>
              )}
              <Box direction="row" alignSelf="start" justify="evenly">
                <Share workshopId={workshopId} />
              </Box>
            </Box>
            <Box direction="row" justify="between" margin={{ bottom: 'small' }}>
              <Box pad={{ vertical: 'small' }} gap="small" direction="row">
                {avatar ? (
                  <Avatar src={avatar} />
                ) : (
                  <Avatar src="/img/SpeakerImages/defaultAvatar.svg" />
                )}
                <Box justify="center">
                  <Text weight="bold" size="large">
                    {presenter}
                  </Text>
                  <Text>{role}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
          {signupLayer && (
            <SignupLayer
              formData={formData}
              reset={resetFormData}
              setFormData={setFormData}
              setLayer={setSignupLayer}
              setSuccess={setSuccessLayer}
              title={title}
              size={size}
              sessionType={sessionType}
              duration={workshopDuration}
            />
          )}
          {successLayer && (
            <SuccessLayer
              setLayer={setSuccessLayer}
              name={formData.name}
              size={size}
              title={title}
              reset={resetFormData}
              sessionType={sessionType}
            />
          )}
          <Box gap="small">
            <Text color="text-strong" size="22px">
              {desc}
            </Text>
            {capacity !== 0 ? (
              /* eslint-disable max-len */
              <Text
                color="text-strong"
                margin={{ bottom: 'large' }}
                size="22px"
              >
                Try it out for yourself. Get some real, hands-on experience by{' '}
                <Link style={{ color: '#FFF' }} color="white" to="/">
                  register for this workshops-on-demand.
                </Link>
              </Text>
            ) : (
              /* eslint-enable max-len */
              <Box pad={{ bottom: 'medium' }} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

Video.propTypes = {
  title: PropTypes.string,
  avatar: PropTypes.string,
  presenter: PropTypes.string,
  role: PropTypes.string,
  desc: PropTypes.string,
  videolink: PropTypes.string,
  current: PropTypes.number,
  replaysLength: PropTypes.number,
  id: PropTypes.number,
  setCurrent: PropTypes.func,
  autoplay: PropTypes.bool,
  notebook: PropTypes.string,
  sessionType: PropTypes.string,
  location: PropTypes.string,
  capacity: PropTypes.number,
  workshopTitle: PropTypes.string,
  workshopId: PropTypes.number,
  workshopDuration: PropTypes.number,
};

export default Video;
