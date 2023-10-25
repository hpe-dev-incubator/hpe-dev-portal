/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Heading, Text, Box, Image } from 'grommet';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Layout,
  VideoList,
  Video,
  PageHeader,
} from '../../components/hackshack';
import AuthService from '../../services/auth.service';
import { SEO } from '../../components';
import GrommetThemeWrapper from '../../components/hackshack/Grommet/GrommetThemeWrapper';

const sortReplays = (replayData, current) => {
  const beggining = [];
  const end = [];

  replayData.map((replay) => {
    if (current > replay.id) {
      end.push(replay);
    } else {
      beggining.push(replay);
    }
    return replay;
  });
  return beggining.concat(end);
};

const ReplayTemplate = (props) => {
  const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
  const getReplaysApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
  const [replays, setReplays] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getReplays = () => {
      axios({
        method: 'GET',
        url: getReplaysApi,
      })
        .then((response) => {
          setReplays(response.data);
        })
        .catch(() => {
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
          console.log(error);
        });
    };
    const getToken = () => {
      AuthService.login().then(
        () => {
          getReplays(AuthService.getCurrentUser().accessToken);
        },
        () => {
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        },
      );
    };
    getToken();
    // eslint-disable-next-line
  }, [error, getReplaysApi]);
  const {
    workshopId,
    workshopTitle,
    workshopDesc,
    workshopImg,
  } = props.pageContext;
  const workshopIndex = workshopId
    ? parseInt(props.pageContext.workshopId, 10)
    : 0;
  const [current, setCurrent] = useState(workshopIndex);
  const [autoplay, setAutoPlay] = useState(false);
  const sortedReplays = sortReplays(replays, current);
  const selectedReplay = replays.find(({ id }) => id === current);

  return (
    <GrommetThemeWrapper>
      <Layout background="/img/BackgroundImages/generic-background.jpg">
        <PageHeader title={workshopTitle}>
          <SEO
            title={workshopTitle}
            description={workshopDesc}
            image={workshopImg}
          />
          {selectedReplay ? (
            <>
              <Video
                videolink={selectedReplay.replayLink}
                id={selectedReplay.id}
                avatar={selectedReplay.avatar}
                desc={selectedReplay.description}
                key={selectedReplay.name}
                presenter={selectedReplay.presenter}
                role={selectedReplay.role}
                title={selectedReplay.name}
                setCurrent={setCurrent}
                current={current}
                replaysLength={replays.length}
                autoplay={autoplay}
                notebook={
                  selectedReplay.workshop && selectedReplay.workshop.notebook
                }
                sessionType={
                  selectedReplay.workshop && selectedReplay.workshop.sessionType
                }
                location={
                  selectedReplay.workshop && selectedReplay.workshop.location
                }
                capacity={
                  selectedReplay.workshop && selectedReplay.workshop.capacity
                }
                workshopTitle={
                  selectedReplay.workshop && selectedReplay.workshop.name
                }
                workshopId={workshopId}
                workshopDuration={
                  selectedReplay.workshop && selectedReplay.workshop.duration
                }
              />
              <Heading color="text" style={{ fontWeight: '500' }} level={2}>
                UP NEXT
              </Heading>
            </>
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
                  <Text size="large" color="status-critical" alignSelf="center">
                    {error}
                  </Text>
                  <Image alt="gremlin rockin" src="/img/gremlin-rockin.svg" />
                </>
              ) : (
                <Box height="medium" />
              )}
            </Box>
          )}
          {sortedReplays.map(
            ({ description, presenter, role, name, replayLink, id }) =>
              id !== current && (
                <VideoList
                  key={name}
                  id={id}
                  desc={`${description.slice(0, 150)}...`}
                  title={name}
                  presenter={presenter}
                  videoLink={replayLink}
                  role={role}
                  setCurrent={setCurrent}
                  setAutoPlay={setAutoPlay}
                />
              ),
          )}
        </PageHeader>
      </Layout>
    </GrommetThemeWrapper>
  );
};

ReplayTemplate.propTypes = {
  pageContext: PropTypes.number,
  // eslint-disable-next-line react/no-unused-prop-types
  path: PropTypes.string,
};

export default ReplayTemplate;
