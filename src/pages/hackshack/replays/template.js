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
import AuthService from '../../../services/auth.service';
import { SEO } from '../../../components';
import GrommetThemeWrapper from '../../../components/hackshack/Grommet/GrommetThemeWrapper';

const sortWorkshops = (workshopDetailsData, current) => {
  const beginning = [];
  const end = [];

  workshopDetailsData.map((workshopDetails) => {
    if (current > workshopDetails.id) {
      end.push(workshopDetails);
    } else {
      beginning.push(workshopDetails);
    }
    return workshopDetails;
  });
  return beginning.concat(end);
};

const ReplayTemplate = (props) => {
  const getWorkshopDetailsApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
  const [workshopDetails, setWorkshopDetails] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getWorkshops = () => {
      axios({
        method: 'GET',
        url: getWorkshopDetailsApi,
      })
        .then((response) => {
          setWorkshopDetails(response.data);
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
          getWorkshops(AuthService.getCurrentUser().accessToken);
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
  }, [error, getWorkshopDetailsApi]);
  const { workshopId, workshopTitle, workshopDesc, workshopImg } =
    props.pageContext;
  const workshopIndex = workshopId
    ? parseInt(props.pageContext.workshopId, 10)
    : 0;
  const [current, setCurrent] = useState(workshopIndex);
  const [autoplay, setAutoPlay] = useState(false);
  const sortedWorkshops = sortWorkshops(workshopDetails, current);
  const selectedWorkshop = workshopDetails.find(({ id }) => id === current);

  return (
    <GrommetThemeWrapper>
      <Layout background="/img/BackgroundImages/generic-background.jpg">
        <Box style={{ minHeight: 'calc(100vh - 345px)' }}>
          <PageHeader title={workshopTitle}>
            <SEO
              title={workshopTitle}
              description={workshopDesc}
              image={workshopImg}
            />
            {selectedWorkshop ? (
              <>
                <Video
                  videolink={selectedWorkshop.videoLink}
                  id={selectedWorkshop.id}
                  avatar={selectedWorkshop.avatar}
                  desc={selectedWorkshop.description}
                  key={selectedWorkshop.name}
                  presenter={selectedWorkshop.presenter}
                  role={selectedWorkshop.role}
                  title={selectedWorkshop.name}
                  setCurrent={setCurrent}
                  current={current}
                  replaysLength={workshopDetails.length}
                  autoplay={autoplay}
                  notebook={selectedWorkshop.notebook}
                  sessionType={selectedWorkshop.sessionType}
                  location={selectedWorkshop.location}
                  capacity={selectedWorkshop.capacity}
                  workshopTitle={selectedWorkshop.name}
                  workshopId={workshopId}
                  workshopDuration={selectedWorkshop.duration}
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
            {sortedWorkshops.map(
              ({ description, presenter, role, name, videoLink, id }) =>
                id !== current && (
                  <VideoList
                    key={name}
                    id={id}
                    desc={`${description.slice(0, 150)}...`}
                    title={name}
                    presenter={presenter}
                    videoLink={videoLink}
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
