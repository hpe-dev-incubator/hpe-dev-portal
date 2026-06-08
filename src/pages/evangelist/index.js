import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Box,
  Text,
  Heading,
  Markdown,
  Paragraph,
  FormField,
  Form,
  TextInput,
  Button,
  ResponsiveContext,
  Layer,
} from 'grommet';
import { StatusGood, FormClose } from 'grommet-icons';

import {
  Content,
  Layout,
  SEO,
  PageDescription,
  Questions,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import AuthService from '../../services/auth.service';

const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;

export const SuccessLayer = ({ setLayer, size, emailId, reset }) => (
  <Layer position="center" style={{ borderRadius: '4px 0px 0px 4px' }}>
    <Button
      alignSelf="end"
      onClick={() => setLayer(false)}
      icon={<FormClose />}
      margin={{ top: 'medium', right: 'medium' }}
    />
    <Box
      height="100%"
      width={size === 'small' ? '100%' : '500px'}
      direction="column"
      pad={{ bottom: 'large', left: 'xlarge', right: 'xlarge' }}
      alignSelf="end"
    >
      <StatusGood size="large" />
      <Box margin={{ bottom: 'medium', top: 'small' }}>
        <Heading margin={{ top: 'none', bottom: 'small' }}>Welcome!</Heading>
        <Text>
          You have successfully registered for the HPE Developer Evangelist
          program. Head over to your email ({emailId}) to learn what happens
          next.
        </Text>
      </Box>
      <Box margin={{ top: 'medium' }}>
        <Button
          alignSelf="start"
          label="close"
          onClick={() => {
            reset();
            setLayer(false);
          }}
          primary
        />
      </Box>
    </Box>
  </Layer>
);

SuccessLayer.propTypes = {
  setLayer: PropTypes.func,
  reset: PropTypes.func,
  size: PropTypes.string,
  emailId: PropTypes.string,
};

function Evangelist({ data }) {
  const post = data.markdownRemark;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody } = post;
  const { title, subtitle } = post.frontmatter;

  const components = {
    p: {
      component: Paragraph,
      props: {
        style: {
          maxWidth: '100%',
        },
      },
    },
  };
  const size = useContext(ResponsiveContext);
  const cardRef = useRef(null);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    city: '',
    state: '',
    country: '',
    proxy: 'hackshack',
  });
  const [hover, setHover] = useState(false);
  const resetFormData = () => {
    setFormData({
      name: '',
      emailId: '',
      city: '',
      state: '',
      country: '',
      proxy: 'hackshack',
    });
  };

  const checkHover = (e) => {
    if (cardRef.current) {
      const mouseOver = cardRef.current.contains(e.target);

      if (!hover && mouseOver) {
        setHover(true);
      }

      if (hover && !mouseOver) {
        setHover(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', checkHover, true);

    return () => {
      window.removeEventListener('mousemove', checkHover, true);
    };
  });

  const emailValidation = (email) => {
    if (email) {
      const emailtemp = email;
      const lastAtPos = emailtemp.lastIndexOf('@');
      const lastDotPos = emailtemp.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          emailtemp.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          emailtemp.length - lastDotPos > 2
        )
      ) {
        setEmailError('Email is not valid');

        return false;
      }
      setEmailError('');
    }
    return true;
  };

  const onSubmit = () => {
    if (emailValidation(formData.emailId)) {
      const postEvangelist = () => {
        axios({
          method: 'POST',
          url: `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/evangelist`,
          headers: {
            'x-access-token': AuthService.getCurrentUser().accessToken,
          },
          data: { ...formData, emailId: formData.emailId.toLowerCase() },
        })
          .then((response) => {
            if (response.status === 202) {
              setError({
                status: response.status,
                message: 'Already registered!!',
              });
            } else {
              setSuccess(true);
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AuthService.login().then(() => postEvangelist());
            } else {
              console.log('err', err);
              setError({
                status: err.response.status,
                message: err.response.data.message,
              });
            }
          });
      };
      postEvangelist();
    }
  };

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <PageDescription
        image="/img/community/evangelist.svg"
        title={title}
        alt="evangelist page logo"
      >
        <Content size="large" width="large">
          <Markdown components={components}>{rawMarkdownBody}</Markdown>
        </Content>
        <Box
          border={{ side: 'horizontal', size: 'small' }}
          pad={{ top: 'small', bottom: 'large' }}
        >
          <Heading level="3"> {subtitle} </Heading>
          <Box direction="row">
            <Form
              validate="blur"
              value={formData}
              onChange={setFormData}
              onSubmit={() => onSubmit()}
              style={{ flex: 1 }}
            >
              <FormField
                label="Company Email"
                name="emailId"
                error={emailError}
                required
                className="row-6"
              >
                <TextInput name="emailId" />
              </FormField>
              <FormField label="Full Name" name="name" required>
                <TextInput name="name" />
              </FormField>
              <FormField label="City" name="city" required>
                <TextInput name="city" />
              </FormField>
              <FormField label="State" name="state" required>
                <TextInput name="state" />
              </FormField>
              <FormField label="Country" name="country" required>
                <TextInput name="country" />
              </FormField>
              {error && error.status ? (
                <Box
                  pad="small"
                  justify="center"
                  margin={{ top: 'medium' }}
                  background="status-critical"
                >
                  <Text alignSelf="center"> {error.message} </Text>
                </Box>
              ) : null}
              <Button
                alignSelf="start"
                label="Register"
                type="submit"
                primary
                margin={{ top: 'medium' }}
              />
            </Form>
            <Box style={{ flex: 1 }} />
          </Box>
        </Box>
        <Questions />
      </PageDescription>
      {success && (
        <SuccessLayer
          setLayer={setSuccess}
          name={formData.name}
          size={size}
          emailId={formData.emailId}
          reset={resetFormData}
        />
      )}
    </Layout>
  );
}

Evangelist.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        subtitle: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Evangelist;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { sourceInstanceName: { eq: "evangelist" } }) {
      id
      frontmatter {
        title
        description
        subtitle
      }
      rawMarkdownBody
    }
  }
`;
