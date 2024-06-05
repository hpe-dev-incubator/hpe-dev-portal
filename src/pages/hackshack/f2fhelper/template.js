/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Heading, Text, Box, Image, DataTable, Button } from 'grommet';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Layout, ScheduleCard, CardGrid } from '../../../components/hackshack';
import { MainTitle } from '../../../components/hackshack/StyledComponents';
import AuthService from '../../../services/auth.service';
import { SEO } from '../../../components';

const Student = (props) => {
  const getStudentsApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/students`;
  const [students, setstudents] = useState([]);
  const [error, setError] = useState('');
  const arr = [];
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);

  useEffect(() => {
    const getToken = () => {
      AuthService.login().then(
        () => {
          getStudents(AuthService.getCurrentUser().accessToken);
        },
        (err) => {
          console.log('Error: ', err);
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        },
      );
    };

    const getStudents = (token) => {
      axios({
        method: 'GET',
        url: getStudentsApi,
        headers: { 'x-access-token': token },
      })
        .then((response) => {
          // Map created
          response.data.forEach((student) => {
            // Check is student is assigned
            if (student.assigned) arr.push({ ...student });
          });
          if (arr.length <= 0)
            setError('There are currently no active students. Stay tuned!');
          setstudents(arr);
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
  }, []);

  console.log('students in students ', students);

  const { title, description, badgeImg } = props.pageContext;

  return (
    <Layout background="/img/hackshack/BackgroundImages/schedule-background.png">
      <SEO title={title} description={description} image={badgeImg} />
      <Box style={{ minHeight: 'calc(100vh - 345px)' }}>
        <>
          <MainTitle>
            <Heading
              color="text-strong"
              margin={{ top: 'none', bottom: 'small' }}
            >
              Active Participants
            </Heading>
          </MainTitle>
          {}
          {students.length > 0 ? (
            <tab>
              <DataTable
                columns={[
                  {
                    property: 'username',
                    header: <Text>Username</Text>,
                    primary: true,
                  },
                  {
                    property: 'password',
                    header: <Text>Password</Text>,
                  },
                  {
                    property: 'url',
                    header: <Text>URL</Text>,
                    render: (datum) => (
                      <Button
                        href={datum.url}
                        target="_blank"
                        label="Connect"
                      />
                    ),
                  },
                ]}
                data={students}
              />
            </tab>
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
        </>
      </Box>
    </Layout>
  );
};

Student.propTypes = {
  pageContext: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
  }),
};

export default Student;
