/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Heading, Text, Box, Image, Tab, Tabs } from 'grommet';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Layout, ScheduleCard, CardGrid } from '../components/hackshack';
import { MainTitle } from '../components/hackshack/StyledComponents';
import AuthService from '../services/auth.service';
import { SEO } from '../components';

const renderScheduleCard = (workshop, i) => (
  <ScheduleCard
    avatar={workshop.avatar}
    desc={
      workshop.sessionType === 'Workshops-on-Demand'
        ? `${workshop.description.slice(0, 520)}`
        : `${workshop.description.slice(0, 220)}...`
    }
    id={workshop.sessionId}
    key={i}
    DBid={workshop.id}
    presenter={workshop.presenter}
    role={workshop.role}
    sessionLink={workshop.replayLink}
    sessionType={workshop.sessionType}
    title={workshop.name}
    notebook={workshop.notebook}
    location={workshop.location}
    replayId={workshop.replayId}
    popular={workshop.popular}
    duration={workshop.duration}
  />
);

const Workshop = (props) => {
  const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
  const getWorkshopsApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
  const [workshops, setworkshops] = useState([]);
  const [error, setError] = useState('');
  const arr = [];
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);

  const latestWorkshops = workshops
    .slice()
    .sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .slice(0, 10);

  useEffect(() => {
    const getToken = () => {
      AuthService.login().then(
        () => {
          /* eslint-disable no-use-before-define */
          getWorkshops(AuthService.getCurrentUser().accessToken);
          /* eslint-enable no-use-before-define */
        },
        (err) => {
          console.log('Error: ', err);
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        },
      );
    };

    const getWorkshops = (token) => {
      axios({
        method: 'GET',
        url: getWorkshopsApi,
        headers: { 'x-access-token': token },
      })
        .then((response) => {
          // Map created
          response.data.forEach((workshop) => {
            if (workshop.sessionType === 'Workshops-on-Demand')
              arr.push({ ...workshop });
          });
          setworkshops(arr);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            AuthService.login().then(() => getToken());
          } else {
            console.log('catch error', err);
            setError(
              'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
            );
          }
        });
    };
    getToken();
    // eslint-disable-next-line
  }, []);

  const { title, description, badgeImg } = props.pageContext;

  return (
    <Layout background="/img/hackshack/BackgroundImages/schedule-background.png">
      <SEO title={title} description={description} image={badgeImg} />
      <MainTitle>
        <Heading color="text-strong" margin={{ top: 'none', bottom: 'small', left: '160px' }} >
          Workshops-on-Demand
        </Heading>
      </MainTitle>
      {workshops.length > 0 ? (
        <Tabs activeIndex={index} onActive={onActive} justify="start" margin={{ top: 'none', bottom: 'small', left: '160px' }}>
          <Tab title="All">
            <CardGrid pad={{ top: 'medium'  }} key="all">
              {workshops.map((workshop, i) => renderScheduleCard(workshop, i))}
            </CardGrid>
          </Tab>
          <Tab title="Latest">
            <CardGrid pad={{ top: 'medium' }} key="ltst">
              {latestWorkshops.map((workshop, i) =>
                renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
          <Tab title="Popular">
            <CardGrid pad={{ top: 'medium' }} key="pop">
              {workshops.map(
                (workshop, i) =>
                  workshop.popular && renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
          <Tab title="Open Source">
            <CardGrid pad={{ top: 'medium' }} key="os">
              {workshops.map(
                (workshop, i) =>
                  workshop.category &&
                  workshop.category.includes('open source') &&
                  renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
          <Tab title="HPE GreenLake">
            <CardGrid pad={{ top: 'medium' }} key="hpee">
              {workshops.map(
                (workshop, i) =>
                  workshop.category &&
                  workshop.category.includes('hpe greenlake') &&
                  renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
          <Tab title="HPE Ezmeral">
            <CardGrid pad={{ top: 'medium' }} key="hpee">
              {workshops.map(
                (workshop, i) =>
                  workshop.category &&
                  workshop.category.includes('hpe ezmeral') &&
                  renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
          <Tab title="Infrastructure">
            <CardGrid pad={{ top: 'medium' }} key="ifa">
              {workshops.map(
                (workshop, i) =>
                  workshop.category &&
                  workshop.category.includes('infrastructure') &&
                  renderScheduleCard(workshop, i),
              )}
            </CardGrid>
          </Tab>
        </Tabs>
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
              <Image
                alt="gremlin rockin"
                src="/img/hackshack/gremlin-rockin.svg"
              />
            </>
          ) : (
            <Box height="medium" />
          )}
        </Box>
      )}
    </Layout>
  );
};

Workshop.propTypes = {
  pageContext: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    badgeImg: PropTypes.string,
  }),
};

export default Workshop;
