/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Anchor, Heading, Text, Box, Image, Tab, Tabs } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Layout, ScheduleCard, CardGrid } from '../../../components/hackshack';
import { MainTitle } from '../../../components/hackshack/StyledComponents';
import { SEO } from '../../../components';

const APIDB = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api`;

const renderScheduleCard = (workshop, i) => (
  <ScheduleCard
    avatar={workshop && workshop.avatar}
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

// Returns true if a workshop belongs to a given category.
// Handles both array-type and string-type category fields, case-insensitively.
const workshopMatchesCategory = (workshop, category) => {
  if (!workshop.category) return false;
  const cats = Array.isArray(workshop.category)
    ? workshop.category
    : [workshop.category];
  return cats.some((c) => c.toLowerCase() === category.toLowerCase());
};

const Workshop = (props) => {
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);

  // Parse ?id= query param to show a single workshop when linked from home page
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const linkedId = searchParams
    ? parseInt(searchParams.get('id'), 10) || null
    : null;

  const latestWorkshops = workshops
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 10);

  const popularWorkshops = workshops.filter((w) => w.popular);

  useEffect(() => {
    axios
      .get(`${APIDB}/workshops?active=true`)
      .then((response) => {
        const arr = [];
        response.data.forEach((workshop) => {
          if (workshop.sessionType === 'Workshops-on-Demand') {
            arr.push({ ...workshop });
          }
        });
        setWorkshops(arr);
      })
      .catch((err) => {
        console.log('Error fetching workshops', err);
        setError(
          'Oops..something went wrong. The WoD team is addressing the problem. Please try again later!',
        );
      });

    axios
      .get(`${APIDB}/workshops/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.log('Error fetching categories', err);
        // Non-fatal: tabs beyond All / Latest / Popular simply won't appear.
      });
  }, []);

  const { title, description, badgeImg } = props.pageContext;

  const linkedWorkshop = linkedId
    ? workshops.find((w) => w.id === linkedId)
    : null;

  return (
    <Layout background="/img/hackshack/BackgroundImages/schedule-background.png">
      <SEO title={title} description={description} image={badgeImg} />
      <Box style={{ minHeight: 'calc(100vh - 345px)' }}>
        <MainTitle>
          <Heading
            color="text-strong"
            margin={{ top: 'none', bottom: 'small' }}
          >
            Workshops-on-Demand
          </Heading>
        </MainTitle>

        {/* Single-workshop view: linked from home page via ?id= */}
        {linkedWorkshop ? (
          <Box>
            <Anchor
              href="/hackshack/workshops"
              icon={<FormPreviousLink />}
              label="View all workshops"
              color="brand"
              margin={{ bottom: 'medium' }}
              style={{ width: 'fit-content' }}
            />
            <CardGrid pad={{ top: 'small' }}>
              {renderScheduleCard(linkedWorkshop, 0)}
            </CardGrid>
          </Box>
        ) : workshops.length > 0 ? (
          <Tabs activeIndex={index} onActive={onActive} justify="start">
            <Tab title="All">
              <CardGrid pad={{ top: 'medium' }} key="all">
                {workshops.map((workshop, i) =>
                  renderScheduleCard(workshop, i),
                )}
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
            {/* One tab per category returned by GET /workshops/categories */}
            {categories.map((category) => (
              <Tab
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              >
                <CardGrid pad={{ top: 'medium' }}>
                  {workshops
                    .filter((workshop) =>
                      workshopMatchesCategory(workshop, category),
                    )
                    .map((workshop, i) => renderScheduleCard(workshop, i))}
                </CardGrid>
              </Tab>
            ))}
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
      </Box>
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
