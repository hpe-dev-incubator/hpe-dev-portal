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
} from '../../../components/hackshack';
import { SEO } from '../../../components';
import GrommetThemeWrapper from '../../../components/hackshack/Grommet/GrommetThemeWrapper';

const sortReplays = (replayData, current) => {
  const beggining = [];
  const end = [];

  replayData.map((replay) => {
    if (current > replay.replayId) {
      end.push(replay);
    } else {
      beggining.push(replay);
    }
    return replay;
  });
  return beggining.concat(end);
};

const ReplayTemplate = (props) => {
  const getWorkshopsApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
  const [replays, setReplays] = useState([]);
  const [error, setError] = useState('');

  const { workshopId, workshopTitle, workshopDesc, workshopImg } =
    props.pageContext;
  const workshopIndex = workshopId
    ? parseInt(props.pageContext.workshopId, 10)
    : 0;
  const [current, setCurrent] = useState(workshopIndex);

  useEffect(() => {
    const getReplays = () => {
      axios({
        method: 'GET',
        url: getWorkshopsApi,
      })
        .then((response) => {
          const filtered = response.data.filter(
            (w) => w.replayLink && w.replayId,
          );
          setReplays(filtered);
          // On the index page (no specific workshopId), default to the first replay
          if (!workshopId && filtered.length > 0) {
            setCurrent(filtered[0].replayId);
          }
        })
        .catch(() => {
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        });
    };
    getReplays();
    // eslint-disable-next-line
  }, []);
  const [autoplay, setAutoPlay] = useState(false);
  const sortedReplays = sortReplays(replays, current);
  const selectedReplay = replays.find(({ replayId }) => replayId === current);

  return (
    <GrommetThemeWrapper>
      <Layout background="/img/BackgroundImages/generic-background.jpg">
        <Box style={{ minHeight: 'calc(100vh - 345px)' }}>
          <PageHeader title={workshopTitle || 'Replays'}>
            <SEO
              title={workshopTitle || 'Replays'}
              description={workshopDesc}
              image={workshopImg}
            />
            {selectedReplay ? (
              <>
                <Video
                  videolink={selectedReplay.replayLink}
                  id={selectedReplay.replayId}
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
                  notebook={selectedReplay.notebook}
                  sessionType={selectedReplay.sessionType}
                  location={selectedReplay.location}
                  capacity={selectedReplay.capacity}
                  workshopTitle={selectedReplay.name}
                  workshopId={workshopId}
                  workshopDuration={selectedReplay.duration}
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
                    <Text
                      size="large"
                      color="status-critical"
                      alignSelf="center"
                    >
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
              ({ description, presenter, role, name, replayLink, replayId }) =>
                replayId &&
                replayId !== current && (
                  <VideoList
                    key={name}
                    id={replayId}
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
        </Box>
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
