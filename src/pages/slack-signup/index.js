import React, { useState,useContext } from 'react';
// import '../../css/style.css';
import Swal from 'sweetalert2';
import { Box, Image, Button, TextInput, Text } from 'grommet';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Layout, SEO } from '../../components';
import { AppContext } from '../../providers/AppProvider';

const { GATSBY_SLACK_TOKEN } = process.env;
const { GATSBY_SLACK_INVITE_URL } = process.env;
const image = '/images/hero-pic.png';
const buttonstyle = {
  backgroundColor: '#dcdcdc',
  borderRadius: '100px',
  align: 'center',
  height: '50px',
  fontSize: '15px',
  fontFamily: 'sans-serif',
};
export default function Slacksignup() {
  const { user: userDetails } = useContext(AppContext);
  const [email, setemail] = useState(userDetails?.email || '');
  const onsubmit = (evt) => {
    evt.preventDefault();
    if (email) {
      const doInvite = () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('token', GATSBY_SLACK_TOKEN);
        formData.append('set_active', true);
        return fetch(GATSBY_SLACK_INVITE_URL, {
          method: 'POST',
          body: formData,
          json: true,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.ok) {
              const el = document.createElement('div');
              el.innerHTML = `Please check <b> ${email}</b> 
                              for an invite from slack`;
              Swal.fire({
                title: 'SUCCESS !',
                html: el,
                icon: 'success',
              });
            } else {
              let { error } = res;
              if (error === 'already_invited' || error === 'already_in_team') {
                const el = document.createElement('div');
                el.innerHTML =
                  "It seems like you are already member of our slack.<br>Visit <a href=https://hpedev.slack.com target='_blank' > <b> HPE Developer Community</b></a> on slack";
                Swal.fire({
                  title: 'Success',
                  html: el,
                  icon: 'success',
                });
              } else if (error === 'already_in_team_invited_user') {
                const l = document.createElement('div');
                l.innerHTML = `Please check again <b style="font-size:large;" > ${email} </b> for an invite from Slack.<br>Visit <a href=https://developer.hpe.com/ target="_blank"> HPE Developer Community</a>`;
                Swal.fire({
                  title: 'It seems like we already sent you our slack invite',
                  html: l,
                  icon: 'info',
                });
              } else {
                if (error === 'invalid_email') {
                  error = 'The email you entered is an invalid email.';
                } else if (error === 'invalid_auth') {
                  error =
                    'Something has gone wrong. Please' +
                    ' contact a system administrator.';
                }
                Swal.fire({
                  title: 'Error',
                  html: error,
                  icon: 'error',
                });
              }
            }
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error !',
              html: err,
              icon: 'error',
            });
          });
      }; // end of doInvite
      doInvite();
    } // end of if statement
    else {
      const errMsg = [];
      if (!email) {
        errMsg.push('your email is required');
      }
      Swal.fire({
        html: `Failed! ${errMsg.join(' and ')}.`,
        icon: 'info',
      });
    }
    setTimeout(() => {
      setemail('');
    }, 2500);
  };
  const handlechange = (event) => {
    setemail(event.target.value);
  };
  return (
    <Layout>
      <SEO title="Slack-signup" />
      <Box direction="row-responsive" pad="xlarge" gap="xlarge" align="center">
        <Box>
          <Box style={{ marginTop: '-30px' }}>
            <Text size="xlarge" style={{ margingTop: '-10px', color: 'grey' }}>
              Sign up for
            </Text>
            <h1
              style={{
                fontFamily: 'sans-serif',
                color: '#220',
                fontWeight: 550,
                letterSpacing: '0.5px',
                fontSize: '63px',
                lineHeight: '5rem',
              }}
            >
              HPE Developer Community <br /> Slack
            </h1>
            <Image
              style={{
                height: '80px',
                width: '100px',
                float: 'right',
                marginTop: '-120px',
                marginLeft: '170px',
              }}
              src="/img/community/slack.svg"
              alt="slack logo"
            />
            <p style={{ fontWeight: 400, fontSize: '22px' }}>
              Where you’ll find all things software at HPE. Join us to
              collaborate and build applications and integrations with HPE
              products using the latest software and open source technologies
            </p>
          </Box>
          <Text size="large">Email</Text>
          <form className="form" id="join-form" onSubmit={onsubmit}>
            <Box align="center" border={{ side: 'bottom', size: 'small' }}>
              <TextInput
                type="email"
                placeholder="example@my.com"
                value={email}
                name="email"
                onChange={handlechange}
                style={{ position: 'relative', marginLeft: '-10px' }}
                required
                plain
              />
            </Box>
            <br />
            <Button
              label="Join us on Slack"
              primary
              reverse
              type="submit"
              onSubmit={onsubmit}
              icon={
                <Image
                  src="/img/home/hpe-element.png"
                  style={{ width: '50px' }}
                />
              }
              style={{
                backgroundColor: '#01A982',
                borderRadius: '100px',
                color: '#ffffff',
                width: '250px',
                position: 'relative',
                height: '40px',
              }}
            />
          </form>
        </Box>
        <Box align="center">
          <Image src={image} alt="hpedev logo" />
        </Box>
      </Box>
      <Box
        direction="row-responsive"
        pad="xlarge"
        gap="medium"
        align="center"
        style={{ marginTop: '-120px' }}
      >
        <Button label="50+ Channels" style={buttonstyle} />
        <Button label="Over 4,000 members" style={buttonstyle} />
        <Button label="6 Years+ Community" style={buttonstyle} />
      </Box>
    </Layout>
  );
}

Slacksignup.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
      }).isRequired,
      rawMarkdownBody: PropTypes.string,
    }).isRequired,
  }),
};
export const slack = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: "/" } }) {
      excerpt
      frontmatter {
        title
        image
      }
      rawMarkdownBody
    }
  }
`;
