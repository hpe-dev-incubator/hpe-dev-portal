import React, { useEffect, useState } from 'react';
import { Heading, Text, Box } from 'grommet';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Layout, ScheduleCard, CardGrid } from '../../../components/hackshack';
import AuthService from '../../../services/auth.service';

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateX(10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
`;

const MainTitle = styled(Box)`
  opacity: 0;
  animation: ${slideUp} 0.8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
`;

const Challenge = () => {
  const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
  // eslint-disable-next-line max-len
  const getChallengesApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}api/workshops?active=true`;
  const [challenges, setchallenges] = useState([]);
  const [error, setError] = useState('');
  const arr = [];

  useEffect(() => {
    const getChallenges = (token) => {
      axios({
        method: 'GET',
        url: getChallengesApi,
        headers: { 'x-access-token': token },
      })
        .then((response) => {
          // Map created
          response.data.forEach((challenge) => {
            if (challenge.sessionType === 'Coding Challenge')
              arr.push({ ...challenge });
          });
          if (arr.length <= 0)
            setError(
              'There are currently no challenges in progress. Stay tuned!',
            );
          setchallenges(arr);
        })
        .catch((err) => {
          setError(
            // eslint-disable-next-line max-len
            'Oops..something went wrong. The HPE DEV team is addressing the problem. Please try again later!',
          );
          console.log(err);
        });
    };
    const getToken = () => {
      AuthService.login().then(
        () => {
          getChallenges(AuthService.getCurrentUser().accessToken);
        },
        () => {
          setError(
            // eslint-disable-next-line max-len
            'Oops..something went wrong. The HPE DEV team is addressing the problem. Please try again later!',
          );
        },
      );
    };
    getToken();
    // eslint-disable-next-line
  }, []);
  return (
    <Layout background="/img/BackgroundImages/schedule-background.png">
      <MainTitle>
        <Heading color="text-strong" margin={{ top: 'none', bottom: 'small' }}>
          CHALLENGES
        </Heading>
        <Text color="text-strong" margin={{ top: 'none', bottom: 'medium' }}>
          Register for Challenges
        </Text>
      </MainTitle>
      {challenges.length > 0 ? (
        <CardGrid>
          {challenges.map((challenge) => (
            <ScheduleCard
              avatar={challenge.avatar}
              desc={
                challenge.sessionType === 'Coding Challenge'
                  ? `${challenge.description.slice(0, 520)}`
                  : `${challenge.description.slice(0, 220)}...`
              }
              id={challenge.sessionId}
              key={challenge.name}
              DBid={challenge.id}
              presenter={challenge.presenter}
              role={challenge.role}
              sessionLink={challenge.replayLink}
              sessionType={challenge.sessionType}
              title={challenge.name}
              notebook={challenge.notebook}
              location={challenge.location}
            />
          ))}
        </CardGrid>
      ) : (
        <Box
          pad="small"
          justify="center"
          margin={{ top: 'medium' }}
          direction="column"
          // background="status-critical"
        >
          {error ? (
            <>
              <Text size="large" alignSelf="center">
                {error}
              </Text>
              <Box height="medium" />
            </>
          ) : (
            <Box height="medium" />
          )}
        </Box>
      )}
    </Layout>
  );
};

export default Challenge;
