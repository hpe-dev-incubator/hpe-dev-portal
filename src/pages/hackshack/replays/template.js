/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Heading, Text, Box, Image } from 'grommet';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Layout,
  PageHeader,
  VideoList,
  Video,
} from '../../../components/hackshack';
import AuthService from '../../../services/auth.service';
import { SEO } from '../../../components';

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

const Replays = (props) => {
  const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
  const getReplaysApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/replays?active=true`;
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
            'Oops..something went wrong. The HPE DEV team is addressing the problem. Please try again later!',
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
            'Oops..something went wrong. The HPE DEV team is addressing the problem. Please try again later!',
          );
        },
      );
    };
    getToken();
    // eslint-disable-next-line
  }, [error, getReplaysApi]);
  const { replayId } = props.pageContext;
  const replayIndex = replayId ? parseInt(props.pageContext.replayId, 10) : 0;
  const [current, setCurrent] = useState(replayIndex);
  const [autoplay, setAutoPlay] = useState(false);
  const sortedReplays = sortReplays(replays, current);
  const openGraphImg =
    replays.length > 0 && props.path.includes('finisher-badge')
      ? replays.length > 0 && replays[current].workshop.badgeImg
      : replays.length > 0 &&
        replays[current].workshop &&
        replays[current].workshop.workshopImg;
  const replayTitle = replays.length > 0 && replays[current].title;
  return (
    <Layout background="/img/hackshack/BackgroundImages/generic-background.svg">
      <PageHeader title={replayTitle}>
        {replays.length > 0 ? (
          <>
            <SEO
              title={replays[current].title}
              description={replays[current].desc}
              image={openGraphImg}
            />
            <Video
              videolink={replays[current].videoLink}
              id={replays[current].id}
              avatar={replays[current].avatar}
              desc={replays[current].desc}
              key={replays[current].title}
              presenter={replays[current].presenter}
              role={replays[current].role}
              title={replays[current].title}
              setCurrent={setCurrent}
              current={current}
              replaysLength={replays.length}
              autoplay={autoplay}
              notebook={
                replays[current].workshop && replays[current].workshop.notebook
              }
              sessionType={
                replays[current].workshop &&
                replays[current].workshop.sessionType
              }
              location={
                replays[current].workshop && replays[current].workshop.location
              }
              capacity={
                replays[current].workshop && replays[current].workshop.capacity
              }
              workshopTitle={
                replays[current].workshop && replays[current].workshop.name
              }
              replayId={replayId}
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
                <Image src="/img/hackshack/gremlin-rockin.svg" />
              </>
            ) : (
              <Box height="medium" />
            )}
          </Box>
        )}
        {sortedReplays.map(
          ({ desc, presenter, role, title, videoLink, id }) =>
            id !== current && (
              <VideoList
                key={title}
                id={id}
                desc={`${desc.slice(0, 150)}...`}
                title={title}
                presenter={presenter}
                videoLink={videoLink}
                role={role}
                setCurrent={setCurrent}
                setAutoPlay={setAutoPlay}
              />
            ),
        )}
      </PageHeader>
    </Layout>
  );
};

Replays.propTypes = {
  pageContext: PropTypes.number,
  path: PropTypes.string,
};

export default Replays;
