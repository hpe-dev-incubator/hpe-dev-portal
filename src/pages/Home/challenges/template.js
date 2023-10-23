/* eslint-disable max-len */
// /* eslint-disable max-len */
// import React, { useEffect, useState } from 'react';
// import { Heading, Text, Box, Image, Tab, Tabs } from 'grommet';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// import { Layout, ScheduleCard, CardGrid } from '../../../components/hackshack';
// import { MainTitle } from '../../../components/hackshack/StyledComponents';
// import AuthService from '../../../services/auth.service';
// import { SEO } from '../../../components';

// const renderScheduleCard = (workshop, i) => (
//   <ScheduleCard
//     avatar={workshop.avatar}
//     desc={
//       workshop.sessionType === 'Workshops-on-Demand'
//         ? `${workshop.description.slice(0, 520)}`
//         : `${workshop.description.slice(0, 220)}...`
//     }
//     id={workshop.sessionId}
//     key={i}
//     DBid={workshop.id}
//     presenter={workshop.presenter}
//     role={workshop.role}
//     sessionLink={workshop.replayLink}
//     sessionType={workshop.sessionType}
//     title={workshop.name}
//     notebook={workshop.notebook}
//     location={workshop.location}
//     replayId={workshop.replayId}
//     popular={workshop.popular}
//     duration={workshop.duration}
//   />
// );

// const Challenge = (props) => {
//   const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
//   const getWorkshopsApi = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops?active=true`;
//   const [workshops, setworkshops] = useState([]);
//   const [error, setError] = useState('');
//   const arr = [];
//   const [index, setIndex] = useState(0);
//   const onActive = (nextIndex) => setIndex(nextIndex);

//   useEffect(() => {
//     const getToken = () => {
//       AuthService.login().then(
//         () => {
//           /* eslint-disable no-use-before-define */
//           getWorkshops(AuthService.getCurrentUser().accessToken);
//           /* eslint-enable no-use-before-define */
//         },
//         (err) => {
//           console.log('Error: ', err);
//           setError(
//             'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
//           );
//         },
//       );
//     };

//     const getWorkshops = (token) => {
//       axios({
//         method: 'GET',
//         url: getWorkshopsApi,
//         headers: { 'x-access-token': token },
//       })
//         .then((response) => {
//           console.log('response ++++', response.data.length);
//           // Map created
//           response.data.forEach((workshop) => {
//             if (workshop.sessionType === 'Coding Challenge')
//               arr.push({ ...workshop });
//           });
//           console.log('challenges ++++', arr.length, arr);
//           if (arr.length <= 0)
//             setError(
//               'There are currently no challenges in progress. Stay tuned!',
//             );
//           setworkshops(arr);
//         })
//         .catch((err) => {
//           if (err.response.status === 401) {
//             AuthService.login().then(() => getToken());
//           } else {
//             console.log('catch error', err);
//             setError(
//               'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
//             );
//           }
//         });
//     };
//     getToken();
//     // eslint-disable-next-line
//   }, []);

//   const { title, description, badgeImg } = props.pageContext;

//   return (
//     <Layout background="/img/hackshack/BackgroundImages/schedule-background.png">
//       <SEO title={title} description={description} image={badgeImg} />
//       <MainTitle>
//         <Heading color="text-strong" margin={{ top: 'none', bottom: 'small' }}>
//           Challenges
//         </Heading>
//       </MainTitle>
//       {/* <Text
//         color="text-strong"
//         weight="bold"
//         margin={{ top: 'none', bottom: 'small' }}
//       >
//         Attention, HPE Discover 2022 attendees! Compete in fun Hack Shack
//         Challenges for awesome prizes!
//       </Text>
//       <Text
//         color="text-strong"
//         size="large"
//         margin={{ top: 'none', bottom: 'small' }}
//       >
//         Six lucky participants who complete a challenge and answer all the quiz
//         questions correctly between 11:00am PT June 28, 2022 and 4:00pm PT June
//         29, 2022 will be chosen to win a CanaKit Raspberry Pi 4 Extreme Kit. You
//         must be present at the Hack Shack celebration party between 5:00-6:00pm
//         PT June 29, 2022 to win a prize. For complete details, refer to the{' '}
//         <Anchor
//           href="/hackshack/hpediscover2022-swchallenges-terms-conditions/"
//           target="_blank"
//           rel="noreferrer noopener"
//         >
//           Terms and Conditions
//         </Anchor>
//         .
//       </Text> */}
//       {/* {console.log('replays in tabs ', workshops)} */}
//       {workshops.length > 0 ? (
//         <Tabs activeIndex={index} onActive={onActive} justify="start">
//           <Tab title="All">
//             <CardGrid pad={{ top: 'medium' }} key="all">
//               {workshops.map((workshop, i) => renderScheduleCard(workshop, i))}
//             </CardGrid>
//           </Tab>
//           <Tab title="Open Source Advocate">
//             <CardGrid pad={{ top: 'medium' }} key="os">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('open source') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab>
//           <Tab title="ML Engineer">
//             <CardGrid pad={{ top: 'medium' }} key="ifa">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('ml engineer') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab>
//           <Tab title="Cloud Architect">
//             <CardGrid pad={{ top: 'medium' }} key="hpee">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('cloud architect') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab>
//           {/* <Tab title="Data-Driven Developer">
//             <CardGrid pad={{ top: 'medium' }} key="os">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('data-driven developer') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab> */}
//           <Tab title="Developer">
//             <CardGrid pad={{ top: 'medium' }} key="os">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('developer') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab>
//           <Tab title="Data Scientist">
//             <CardGrid pad={{ top: 'medium' }} key="os">
//               {workshops.map(
//                 (workshop, i) =>
//                   workshop.category &&
//                   workshop.category.includes('data scientist') &&
//                   renderScheduleCard(workshop, i),
//               )}
//             </CardGrid>
//           </Tab>
//         </Tabs>
//       ) : (
//         <Box
//           pad="small"
//           justify="center"
//           margin={{ top: 'medium' }}
//           direction="column"
//           // background="status-critical"
//         >
//           {error ? (
//             <>
//               <Text size="large" color="status-critical" alignSelf="center">
//                 {error}
//               </Text>
//               <Image
//                 alt="gremlin rockin"
//                 src="/img/hackshack/gremlin-rockin.svg"
//               />
//             </>
//           ) : (
//             <Box height="medium" />
//           )}
//         </Box>
//       )}
//     </Layout>
//   );
// };

// Challenge.propTypes = {
//   pageContext: PropTypes.shape({
//     title: PropTypes.string,
//     description: PropTypes.string,
//     badgeImg: PropTypes.string,
//   }),
// };

// export default Challenge;
