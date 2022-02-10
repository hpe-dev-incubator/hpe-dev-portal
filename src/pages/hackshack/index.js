/* eslint-disable max-len */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Image,
  ResponsiveContext,
  Anchor,
  Button,
  Stack,
  Video,
  Layer,
  Grommet,
} from 'grommet';
import { Close } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';
import styled, { keyframes } from 'styled-components';
import Helmet from 'react-helmet';
import { SEO } from '../../components';
import { Layout, Card } from '../../components/hackshack';

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(1.1);
  }

  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
`;

const MainWrapper = styled(Box)`
  margin-top: 0px;
  transform: rotate(-10deg);
  @media (min-width: 900px) {
    margin-top: -200px;
  }
`;

const LogoWrapper = styled(Box)`
  width: 100%;
  max-width: 981px;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
  @media (min-width: 900px) {
    min-width: 600px;
  }
`;

const TextWrapper = styled(Box)`
  padding-left: 0%;
  opacity: 0;
  white-space: nowrap;
  animation: ${slideIn} 0.6s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
  @media (min-width: 900px) {
    padding-left: 30%;
  }
`;

// const ButtonWrapper = styled(Box)`
//   padding-top: 31px;
//   margin-left: 0px;
//   opacity: 0;
//   animation: ${slideIn} 0.3s ease-out;
//   animation-fill-mode: forwards;
//   animation-delay: 0.7s;
//   @media (min-width: 900px) {
//     margin-left: -170px;
//   }
// `;

const StyledLayer = styled(Layer)`
  background-color: rgba(38, 48, 64, 0.8);
  backdrop-filter: blur(15px);
`;

const StyledStack = styled(Box)`
  margin-left: 0px;
  margin-top: -80px;
  @media (min-width: 900px) {
    margin-left: -330px;
    margin-bottom: -300px;
  }
  @media (min-width: 1500px) {
    margin-top: -200px;
    margin-bottom: 0px;
  }
`;

const StyledGremlin = styled(Box)`
  width: 200px;
  margin-top: 100px;
  visibility: hidden;
  @media (min-width: 900px) {
    visibility: visible;
    height: 100%;
    width: 100%;
  }
`;

const StyledBubble = styled(Box)`
  margin-left: 290px;
  margin-bottom: 140px;
  visibility: hidden;
  @media (min-width: 900px) {
    visibility: visible;
    margin-left: 540px;
    margin-bottom: 120px;
    width: 420px;
  }
`;

const StyledTextBox = styled(Box)`
  margin-left: 470px;
  margin-bottom: 260px;
  @media (min-width: 600px) {
    margin-left: 730px;
    margin-bottom: 270px;
  }
`;

const StyledPlayButton = styled(Box)`
  margin-left: 290px;
  margin-bottom: 280px;
  visibility: hidden;
  @media (min-width: 900px) {
    visibility: visible;
    margin-bottom: 230px;
    margin-left: 660px;
  }
`;

const StyledBoxText = styled(Box)`
  visibility: hidden;
  @media (min-width: 800px) {
    visibility: visible;
  }
`;

const CardWrapper = styled(Box)`
  flex-direction: column;
  align-self: center;
  margin-bottom: 48px;
  margin-top: 50px;
  @media (min-width: 900px) {
    align-self: center;
    flex-direction: column;
  }
  @media (min-width: 1500px) {
    margin-top: -220px;
    transform: rotate(-10deg);
    align-self: flex-end;
    flex-direction: row;
  }
`;

const Content = () => {
  const size = useContext(ResponsiveContext);
  const fontSize = size === 'small' ? '4vw' : '2.2vw';
  return (
    <TextWrapper>
      <Text size={fontSize} color="#FFFFFF">
        Welcome to the Hack Shack. We offer many
      </Text>
      <Text size={fontSize} color="#FFFFFF">
        ways to collaborate and expand your skills.
      </Text>
      <Text size={fontSize} color="#FFFFFF">
        Try our technology Workshops-on-Demand,
      </Text>
      <Text size={fontSize} color="#FFFFFF">
        for a unique, hands-on learning experience.
      </Text>
    </TextWrapper>
    // <TextWrapper>
    //   <Text size={fontSize} color="#FFFFFF">
    //     Welcome to the Hack Shack, a place to collaborate
    //   </Text>
    //   <Text size={fontSize} color="#FFFFFF">
    //     and expand technology skills. Try our unique on-demand
    //   </Text>
    //   <Text size={fontSize} color="#FFFFFF">
    //     workshops or go on a virtual treasure hunt to discover
    //   </Text>
    //   <Text size={fontSize} color="#FFFFFF">
    //     a wealth of other resources and perhaps win a prize.
    //   </Text>
    // </TextWrapper>
  );
};
const GrommetMascot = ({ setOpen }) => (
  <StyledStack>
    <Stack anchor="bottom" alignSelf="start">
      <StyledGremlin>
        <Image src="/img/hackshack/gremlinInBubble.png" />
      </StyledGremlin>
      <StyledBubble>
        <Image src="/img/hackshack/quotebubble.png" />
      </StyledBubble>
      <StyledTextBox gap="small">
        <StyledBoxText width="medium">
          <Text size="large" color="#000000">
            Take a tour of
          </Text>
          <Text size="large" color="#000000">
            the Hack Shack!
          </Text>
        </StyledBoxText>
      </StyledTextBox>
      <StyledPlayButton
        gap="small"
        alignSelf="end"
        direction="row"
        onClick={() => setOpen(true)}
      >
        <Anchor
          alignSelf="center"
          color="#000000"
          size="large"
          label={
            <Box gap="xsmall" direction="row">
              <Text style={{ whiteSpace: 'nowrap' }} size="large">
                Watch video
              </Text>
            </Box>
          }
        />
        <Image
          style={{ width: '38px', height: '38px' }}
          src="/img/hackshack/play-button.png"
          margin={{ bottom: '4px' }}
        />
      </StyledPlayButton>
    </Stack>
  </StyledStack>
);

GrommetMascot.propTypes = {
  setOpen: PropTypes.func,
};

const Cards = ({ size }) => (
  <CardWrapper gap="large">
    {size === 'small' && (
      <Card
        logo="/img/hackshack/StickerPage/gremlin.png"
        title="New to the HPE DEV Hack Shack?"
        desc="Watch this video!"
        background="rgba(0, 86, 122, 0.8);"
        label="Watch Now"
        link="https://vimeo.com/539879968"
        margin={size === 'small' ? { bottom: 'none' } : { bottom: 'xlarge' }}
      />
    )}
    <Card
      image="/img/hackshack/workshops-on-demand.png"
      title="INTRODUCING HPE DEV WORKSHOPS-ON-DEMAND"
      desc="Learn more about our technologies through hands-on experience."
      path="/workshops"
      background="background"
      label="Register Now!"
      margin={
        size === 'small'
          ? { top: '0px', right: '0px' }
          : { top: 'xlarge', right: 'large' }
      }
    />
    <Card
      image="/img/hackshack/MunchAndLearn/munch-learn-generic.jpg"
      title="Location, location, location! With data everywhere, location 
      matters more than ever.Learn how succeed at the Edge with HPE Ezmeral 
      and NVIDIA"
      desc="Join HPE and NVIDIA to learn how best accelerate your success 
      at the Edge."
      link=" https://hpe.zoom.us/webinar/register/WN_JLPveMmYSOWd1Mn-7bU62Q"
      date="January 19, 2022"
      background="rgba(0, 86, 122, 0.8);"
      label="Register Now!"
      margin={
        size === 'small'
          ? { top: '0px', right: '0px' }
          : { top: 'xlarge', right: 'large' }
      }
    />
    {/* <Card
      image="/img/Arcade/TreasureMap.png"
      title="WIN IN THE HPE DEV TREASURE HUNT"
      desc="Discover ways to collaborate and where to find resources."
      link="https://bit.ly/kubecon-na-2021-hpedev-treasure-hunt"
      background="rgba(0, 86, 122, 0.8);"
      label="Hunt for Treasure!"
      margin={size === 'small' ? { bottom: 'none' } : { bottom: 'xlarge' }}
    /> */}
    {/* <Card
      logo="/img/Community/dev-thumb.png"
      title="GET THE HPE DEVELOPER NEWSLETTER"
      desc="Want to read more about industry 
        trends for developers? Sign up here."
      link="https://developer.hpe.com/newsletter-signup"
      background="background"
      label="Get the Newsletter"
      margin={
        size === 'small'
          ? { top: '0px', right: '0px' }
          : { top: 'xlarge', right: 'large' }
      }
    /> */}
    {/* <Card
      image="/img/Arcade/score.png"
      title="PLAY HACK SHACK ATTACK, OUR RETRO VIDEO GAME"
      desc="Compete with your friends for bragging rights."
      path="/hackshackattack"
      background="rgba(0, 86, 122, 0.8);"
      label="Play the Game"
      margin={size === 'small' ? { bottom: 'none' } : { bottom: 'xlarge' }}
    /> */}
  </CardWrapper>
);

Cards.propTypes = {
  size: PropTypes.string,
};

const ResponsiveContextWrapper = ({ children }, setOpen) => {
  const size = useContext(ResponsiveContext);
  return (
    <Box
      height="100%"
      width="100%"
      margin={size === 'small' ? null : { top: '50px' }}
    >
      {children}
      {size !== 'small' && <GrommetMascot setOpen={setOpen} />}
      <Cards size={size} />
    </Box>
  );
};

ResponsiveContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const Home = () => {
  const [open, setOpen] = useState();
  const onClose = () => setOpen(undefined);

  return (
    <Grommet theme={hpe}>
      <Layout background="/img/hackshack/BackgroundImages/hack-shack-home-background.png">
        <SEO title="Hack Shack" />
        <Helmet>
          <body margin="0" />
        </Helmet>
        <ResponsiveContextWrapper setOpen={setOpen}>
          {open && (
            <StyledLayer
              full
              animation="fadeIn"
              onClickOutside={onClose}
              onEsc={onClose}
            >
              <Box alignSelf="end" pad={{ top: 'large', bottom: 'xsmall' }}>
                <Button
                  alignSelf="end"
                  label={
                    <Text weight="normal" color="white" size="xlarge">
                      Close
                    </Text>
                  }
                  reverse
                  icon={<Close size="medium" />}
                  onClick={onClose}
                />
              </Box>
              <Box alignSelf="center">
                <Video controls="over" autoPlay fit="cover">
                  <source
                    key="video"
                    src="https://player.vimeo.com/external/539879968.hd.mp4?s=1ff575d7f35468a09a8ad9ac86361989b4cb33e5&profile_id=174"
                    type="video/mp4"
                  />
                  <track
                    key="cc"
                    label="English"
                    kind="subtitles"
                    srcLang="en"
                    src="/img/assets/small-en.vtt"
                    default
                  />
                </Video>
              </Box>
            </StyledLayer>
          )}
          <MainWrapper align="center">
            <LogoWrapper>
              <Image
                width="100%"
                fit="cover"
                src="/img/hackshack/hack-shack-logo.png"
                alt="Hack Shack"
              />
            </LogoWrapper>
            <Content />
            {/* <ButtonWrapper>
              <ButtonSplit to="https://developer.hpe.com">
                Visit HPE DEV Community Portal
              </ButtonSplit>
            </ButtonWrapper> */}
          </MainWrapper>
        </ResponsiveContextWrapper>
      </Layout>
    </Grommet>
  );
};

export default Home;
