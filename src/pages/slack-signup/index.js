import React, { useState, useContext } from 'react';
// import '../../css/style.css';
import Swal from 'sweetalert2';
import { Box, Image, Button, TextInput, Text } from 'grommet';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Layout, SEO } from '../../components';
import { AppContext } from '../../providers/AppProvider';

const image = '/images/hero-pic.png';
const buttonStyle = {
  backgroundColor: '#dcdcdc',
  borderRadius: '100px',
  align: 'center',
  height: '50px',
  fontSize: '15px',
  fontFamily: 'sans-serif',
};
export default function Slacksignup() {
  const slackInviteApi = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/slack/invite`;
  const { user: userDetails } = useContext(AppContext);
  const [email, setEmail] = useState(userDetails?.email || '');

  const onsubmit = async (evt) => {
    evt.preventDefault();

    if (!email) {
      Swal.fire({
        html: `Failed! your email is required.`,
        icon: 'info',
      });
      return;
    }

    try {
      const response = await fetch(slackInviteApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const res = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          html: `Please check <b>${email}</b> for an invite from Slack.`,
          icon: 'success',
        });
      } else {
        const { error } = res;

        let htmlContent = '';
        if (error === 'already_invited' || error === 'already_in_team') {
          htmlContent = `It looks like you're already a member. Visit <a href="https://hpedev.slack.com" target="_blank"><b>HPE Developer Community</b></a> on Slack.`;
        } else if (error === 'already_in_team_invited_user') {
          htmlContent = `An invite was already sent to <b>${email}</b>. Please check your inbox.<br>Visit <a href="https://developer.hpe.com/" target="_blank">HPE Developer Community</a>.`;
        } else if (error === 'invalid_email') {
          htmlContent = 'The email you entered is invalid.';
        } else {
          htmlContent =
            error || 'Something went wrong. Please try again later.';
        }

        Swal.fire({
          title: 'Slack Invite Info',
          html: htmlContent,
          icon: 'info',
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        html: err.message || 'Unknown error occurred.',
        icon: 'error',
      });
    } finally {
      setTimeout(() => {
        setEmail('');
      }, 2500);
    }
  };
  const handleChange = (event) => {
    setEmail(event.target.value);
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
                onChange={handleChange}
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
        <Button label="50+ Channels" style={buttonStyle} />
        <Button label="Over 4,000 members" style={buttonStyle} />
        <Button label="6 Years+ Community" style={buttonStyle} />
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
