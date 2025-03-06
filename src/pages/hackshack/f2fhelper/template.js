/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Heading, Text, Box, Image, DataTable, Button } from 'grommet';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Layout, ScheduleCard, CardGrid } from '../../../components/hackshack';
import { MainTitle } from '../../../components/hackshack/StyledComponents';
import { SEO } from '../../../components';

const Student = (props) => {
  const getStudentsApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/students`;
  const getCustomerApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/customers`;
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const arr = [];
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);

  useEffect(() => {
    // get the details from customers table where lastEmailSent = 'credentials' or 'expiring'
    // this customer data will have a studentId
    // Make getStudents API call by studentId and display the username and password.
    const getCustomers = (token) => {
      axios({
        method: 'GET',
        url: getCustomerApi,
      })
        .then((response) => {
          if (response.data.length) {
            const filteredData = response.data.filter(
              (item) =>
                item.lastEmailSent === 'credentials' ||
                item.lastEmailSent === 'expiring',
            );
            if (filteredData.length) {
              filteredData.forEach((item) => {
                getStudents(item.studentId);
              });
            } else {
              setError('There are currently no active students. Stay tuned!');
            }
          }
        })
        .catch((err) => {
          console.log('err', err);
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        });
    };

    const getStudents = (studentId) => {
      axios({
        method: 'GET',
        url: `${getStudentsApi}/${studentId}`,
      })
        .then((response) => {
          arr.push({ ...response.data });
          const data = [...arr];
          setStudents(data);

          if (arr.length <= 0)
            setError('There are currently no active students. Stay tuned!');
        })
        .catch((err) => {
          setError(
            'Oops..something went wrong. The HPE Developer team is addressing the problem. Please try again later!',
          );
        });
    };
    getCustomers();
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
