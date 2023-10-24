/* eslint-disable max-len */
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import {
  Heading,
  Layer,
  Box,
  Text,
  FormField,
  Form,
  CheckBox,
  Button,
  Anchor,
  TextInput,
  Avatar,
  DropButton,
  ResponsiveContext,
} from 'grommet';
import {
  StatusGood,
  FormClose,
  ShareOption,
  CircleInformation,
} from 'grommet-icons';
import PropTypes from 'prop-types';
// import { Link } from 'gatsby';
import { CardWrapper, ContrastLayer } from './styles';
import AuthService from '../../../services/auth.service';
import { AppContext } from '../../../providers/AppProvider';
import Share from '../Share';

const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;

export const UnregisterLayer = ({
  formData,
  setFormData,
  title,
  customerId,
  setUnregisterLayer,
  setUnresigsterSuccess,
  resetUnregisterFormData,
  setTryAgainLater,
  endDate,
}) => {
  const [usernameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const getTimeLeft = (ends) => {
    const dateFuture = new Date(ends);
    const dateNow = new Date();

    const seconds = Math.floor((dateFuture - dateNow) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours -= days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;

    return { hours, minutes };
  };

  const unregisterCustomer = () => {
    const unregister = () => {
      axios({
        method: 'GET',
        // eslint-disable-next-line max-len
        url: `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/customers/${customerId}`,
        headers: {
          'x-access-token': AuthService.getCurrentUser().accessToken,
        },
      })
        .then((customerData) => {
          axios({
            method: 'GET',
            // eslint-disable-next-line max-len
            url: `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/students/${customerData.data.studentId}`,
            headers: {
              'x-access-token': AuthService.getCurrentUser().accessToken,
            },
          }).then((studentData) => {
            if (formData.username !== studentData.data.username) {
              setUserNameError('User name not found');
            } else if (formData.password !== studentData.data.password) {
              setPasswordError('Invalid password');
              setUserNameError('');
            } else {
              axios({
                method: 'PUT',
                // eslint-disable-next-line max-len
                url: `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/customer/unregister/${customerId}`,
                headers: {
                  'x-access-token': AuthService.getCurrentUser().accessToken,
                },
              })
                .then(() => {
                  setUnregisterLayer(false);
                  setUnresigsterSuccess(
                    <Text alignSelf="center" margin="small" size="xsmall">
                      Sucessfully unregistered from{' '}
                      {customerData.data.sessionName} workshop!
                    </Text>,
                  );
                  resetUnregisterFormData();
                  setTryAgainLater(false);
                })
                .catch((err) => {
                  console.log('err: ', err);
                });
            }
          });
        })
        .catch((err) => {
          console.log('err: ', err);
        });
    };
    unregister();
  };

  const { hours, minutes } = getTimeLeft(endDate);
  const timeLeftString = `${hours} hour${
    hours === 1 ? '' : 's'
  } and ${minutes} minute${minutes === 1 ? '' : 's'}`;

  return (
    <Layer position="center">
      <Box pad="medium">
        <Heading level="3" margin={{ top: 'none' }}>
          Already Registered
        </Heading>
        <Text margin={{ bottom: 'medium' }}>
          You are already registered for the <strong>{title}</strong> workshop
          and can only register for one of the Workshops-on-Demand at a time.
        </Text>
        <Text>
          Try again in {timeLeftString} or unregister from{' '}
          <strong>{title}</strong> by entering your credentials recieved in your
          email.
        </Text>
        <Form
          validate="blur"
          value={formData}
          onChange={setFormData}
          onSubmit={({ value }) => unregisterCustomer({ value })}
        >
          <Box width="300px" margin={{ vertical: 'small' }}>
            <FormField
              label="User Name*"
              name="username"
              error={usernameError}
              required
            >
              <TextInput name="username" />
            </FormField>
            <FormField
              label="Password*"
              name="password"
              error={passwordError}
              required
            >
              <TextInput name="password" type="password" />
            </FormField>
          </Box>
          <Box direction="row" gap="small" margin={{ bottom: 'large' }}>
            <CircleInformation size="medium" />
            <Text>
              Unregistering from <strong>{title}</strong> workshop will end your
              session and reset your student account. Please remember to save
              your work and download the workshop notebook if you anticipate
              requiring it in the future.
            </Text>
          </Box>
          <Button
            alignSelf="start"
            label="Unregister"
            type="submit"
            margin={{ right: 'medium' }}
            primary
          />
          <Button
            alignSelf="start"
            label="Try again later"
            onClick={async () => {
              setUnregisterLayer(false);
              resetUnregisterFormData();
              setTryAgainLater(true);
            }}
            secondary
          />
        </Form>
      </Box>
    </Layer>
  );
};

UnregisterLayer.propTypes = {
  customerId: PropTypes.number,
  setUnregisterLayer: PropTypes.func,
  setUnresigsterSuccess: PropTypes.func,
  resetUnregisterFormData: PropTypes.func,
  setTryAgainLater: PropTypes.func,
  endDate: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
};

export const SignupLayer = ({
  // reset,
  setLayer,
  setFormData,
  formData,
  setSuccess,
  size,
  title,
  sessionType,
  duration,
}) => {
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [unregisterCustomerData, setUnregisterCustomerData] = useState();
  const [unregisterLayer, setUnregisterLayer] = useState(false);
  const [unregisterSuccess, setUnresigsterSuccess] = useState('');
  const [tryAgainLater, setTryAgainLater] = useState(false);
  const [unregisterFormData, setUnregisterFormData] = useState({
    username: '',
    password: '',
  });

  const resetUnregisterFormData = () => {
    setUnregisterFormData({
      username: '',
      password: '',
    });
  };
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

  useEffect(() => {
    if (!unregisterLayer && tryAgainLater) {
      setLayer(false);
    }
  }, [unregisterLayer, setLayer, tryAgainLater]);

  const onSubmit = () => {
    if (emailValidation(formData.email)) {
      const postCustomer = () => {
        axios({
          method: 'POST',
          url: `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/customer`,
          headers: {
            'x-access-token': AuthService.getCurrentUser().accessToken,
          },
          data: { ...formData, email: formData.email.toLowerCase() },
        })
          .then((response) => {
            if (response.status === 202) {
              const { data } = response;
              setUnregisterCustomerData({
                status: response.status,
                ...data,
              });
              setUnregisterLayer(true);
            } else {
              setLayer(false);
              setSuccess(true);
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AuthService.login().then(() => postCustomer());
            } else {
              console.log('err', err);
              setError({
                status: err.response.status,
                message: err.response.data.message,
              });
            }
          });
      };
      postCustomer();
    }
  };
  return (
    <Layer
      position="right"
      full={size === 'large' ? true : 'vertical'}
      style={{ borderRadius: '4px 0px 0px 4px' }}
      background={
        size === 'large'
          ? {
              image: 'url(/img/hackshack/gremlin-signup.png)',
              size: 'cover',
              position: 'center',
              repeat: 'no-repeat',
              opacity: '0.99',
            }
          : {
              color: '#333333',
            }
      }
    >
      <Button
        onClick={() => {
          // reset();
          setLayer(false);
        }}
        alignSelf="end"
        icon={<FormClose />}
        margin={{ top: 'medium', right: 'medium' }}
      />
      <Box
        overflow="auto"
        height="950px"
        width={size === 'small' ? '100%' : '500px'}
        direction="column"
        pad={{ bottom: 'large', left: 'xlarge', right: 'xlarge' }}
        margin={size === 'large' ? { right: '100px' } : { right: '0' }}
        alignSelf="end"
      >
        <Heading color="#ffffff" margin={{ top: 'none', bottom: 'small' }}>
          Register
        </Heading>
        <Text color="#ffffff" margin={{ top: 'none', bottom: 'small' }}>
          {title} {sessionType === 'Workshops-on-Demand' ? 'workshop' : ''}
        </Text>
        <Form
          validate="blur"
          value={formData}
          onChange={setFormData}
          onSubmit={({ value }) => onSubmit({ value })}
        >
          <FormField
            label="Company Email"
            name="email"
            error={emailError}
            required
          >
            <TextInput
              name="email"
              value={formData.email}
              onChange={setFormData}
            />
          </FormField>
          <FormField label="Full Name" name="name" required>
            <TextInput
              name="name"
              value={formData.name}
              onChange={setFormData}
            />
          </FormField>
          <FormField label="Company Name" name="company" required>
            <TextInput
              name="company"
              value={formData.company}
              onChange={setFormData}
            />
          </FormField>
          <Box
            margin={{ top: 'medium' }}
            gap={unregisterSuccess ? 'none' : 'medium'}
          >
            <FormField required name="termsAndConditions">
              <CheckBox
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={setFormData}
                label={
                  sessionType === 'Coding Challenge' ? (
                    <Text>
                      I have read and accept the Hack Shack Challenge{' '}
                      <Anchor
                        target="_blank"
                        label="Terms and Conditions"
                        href="/hackshack/hpediscover2022-swchallenges-terms-conditions"
                      />{' '}
                      and{' '}
                      <Anchor
                        label="HPE's Privacy Policy"
                        href="https://www.hpe.com/us/en/legal/privacy.html"
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                      , and acknowledge that clicking on the{' '}
                      <strong>Take on the Challenge</strong> button below starts
                      the
                      <strong> {duration}-hour</strong> window in which to
                      complete the challenge.
                      <br />
                      <b>
                        <i>Note:</i>
                      </b>{' '}
                      After clicking the button, go directly to your email to
                      receive your confirmation and login credentials.
                    </Text>
                  ) : (
                    <Text>
                      I have read and accept the Hack Shack Workshop{' '}
                      <Anchor
                        target="_blank"
                        label="Terms and Conditions"
                        href="/Home/workshop-terms-conditions"
                      />{' '}
                      and{' '}
                      <Anchor
                        label="HPE's Privacy Policy"
                        href="https://www.hpe.com/us/en/legal/privacy.html"
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                      , and acknowledge that clicking on the{' '}
                      <strong>Register for the Workshop</strong> button below
                      starts the
                      <strong> {duration}-hour</strong> window in which to
                      complete the workshop.
                      <br />
                      <b>
                        <i>Note:</i>
                      </b>{' '}
                      After clicking the button, go directly to your email to
                      receive your confirmation and login credentials.
                    </Text>
                  )
                }
              />
            </FormField>
            {unregisterSuccess && (
              <Box
                border={{ color: 'validation-ok' }}
                justify="center"
                margin={{ top: 'small', bottom: 'medium' }}
              >
                {unregisterSuccess}
              </Box>
            )}
            <Button
              alignSelf="start"
              label={
                sessionType === 'Coding Challenge'
                  ? 'Take on the Challenge'
                  : 'Register for the Workshop'
              }
              type="submit"
              primary
            />
          </Box>
          {unregisterLayer && (
            <UnregisterLayer
              formData={unregisterFormData}
              resetUnregisterFormData={resetUnregisterFormData}
              setFormData={setUnregisterFormData}
              setUnregisterLayer={setUnregisterLayer}
              setUnresigsterSuccess={setUnresigsterSuccess}
              setLayer={setLayer}
              setTryAgainLater={setTryAgainLater}
              customerId={unregisterCustomerData.id}
              title={unregisterCustomerData.title}
              endDate={unregisterCustomerData.endDate}
            />
          )}
          {error.status && error.status !== 202 ? (
            <Box
              pad="small"
              justify="center"
              margin={{ top: 'medium' }}
              background="status-critical"
            >
              <Text alignSelf="center">{error.message}</Text>
            </Box>
          ) : null}
        </Form>
      </Box>
    </Layer>
  );
};

SignupLayer.propTypes = {
  // reset: PropTypes.func,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  setLayer: PropTypes.func,
  setSuccess: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  sessionType: PropTypes.string,
  duration: PropTypes.number,
};

export const SuccessLayer = ({
  name,
  setLayer,
  size,
  title,
  email,
  // reset,
  sessionType,
}) => (
  <Layer
    position="right"
    full={size === 'large' ? true : 'vertical'}
    style={{ borderRadius: '4px 0px 0px 4px' }}
    background={
      size === 'large'
        ? {
            image: 'url(/img/hackshack/gremlin-signup.png)',
            size: 'cover',
            position: 'center',
            repeat: 'no-repeat',
            opacity: '0.99',
          }
        : {
            color: '#333333',
          }
    }
  >
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
        <Heading color="#ffffff" margin={{ top: 'none', bottom: 'small' }}>
          {sessionType === 'Coding Challenge'
            ? 'Challenge Accepted!'
            : "You're Registered!"}
        </Heading>
        <Text color="#ffffff">
          You have been signed up for this{' '}
          {sessionType === 'Coding Challenge' ? 'Challenge' : 'workshop'}. Head
          over to your email ({email}) to learn what happens next.
        </Text>
      </Box>
      <Box>
        <Text>Your registration info:</Text>
        <Text>
          {' '}
          <Text color="#ffffff" weight="bold">
            {name}
          </Text>{' '}
          is signed up for{' '}
          <Text color="#ffffff" weight="bold">
            {title}
          </Text>
        </Text>
      </Box>
      <Box margin={{ top: 'large' }}>
        <Button
          alignSelf="start"
          label="close"
          onClick={() => {
            // reset();
            setLayer(false);
          }}
          primary
        />
      </Box>
    </Box>
  </Layer>
);

SuccessLayer.propTypes = {
  name: PropTypes.string,
  setLayer: PropTypes.func,
  // reset: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  email: PropTypes.string,
  sessionType: PropTypes.string,
};

const ScheduleCard = ({
  avatar,
  desc,
  DBid,
  notebook,
  presenter,
  role,
  sessionLink,
  sessionType,
  title,
  workshopList,
  location,
  ezmeral,
  replayId,
  duration,
  popular,
}) => {
  const size = useContext(ResponsiveContext);
  const { user: userDetail } = useContext(AppContext);
  const textSize = size === 'small' ? '16px' : 'medium';
  let backgroundColor;
  let uri = '';
  switch (sessionType) {
    case 'Workshops-on-Demand':
      backgroundColor = '#263040';
      uri = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops/`;
      break;
    case 'Coding Challenge':
      backgroundColor = 'rgba(155, 99, 16, 0.8)';
      uri = `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/workshops/`;
      break;
    default:
      backgroundColor = 'background';
  }
  const cardRef = useRef(null);
  const [cardTopSectionHeight, setcardTopSectionHeight] = useState(false);
  const [signupLayer, setSignupLayer] = useState(false);
  const [successLayer, setSuccessLayer] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: userDetail?.name || '',
    email: userDetail?.email || '',
    company: userDetail?.type || '',
    title,
    notebook,
    sessionType,
    location,
    termsAndConditions: false,
    proxy: 'hackshack',
  });

  const [hover, setHover] = useState(false);
  // const resetFormData = () => {
  const handlechange = (e) => {
    const { name, value, type, checked } = e.target || '';
    const inputvalue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: inputvalue,
    });
  };
  // };

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
    const getWorkshopbyID = () => {
      axios({
        method: 'GET',
        url: `${uri}${DBid}`,
        headers: { 'x-access-token': AuthService.getCurrentUser().accessToken },
      })
        .then((res) => {
          if (res.data.capacity <= 0) {
            setDisabled(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            AuthService.login().then(() => getWorkshopbyID());
          }
        });
    };
    if (
      sessionType &&
      (sessionType === 'Workshops-on-Demand' ||
        sessionType === 'Coding Challenge')
    ) {
      getWorkshopbyID();
    }
  }, [DBid, sessionType, uri]);

  useEffect(() => {
    if (cardRef.current) {
      const refHeight = cardRef.current.offsetHeight;
      setcardTopSectionHeight(refHeight);
    }
  }, [cardRef]);

  useEffect(() => {
    window.addEventListener('mousemove', checkHover, true);

    return () => {
      window.removeEventListener('mousemove', checkHover, true);
    };
  });

  const registerButtonStatus = (status) => {
    if (status) {
      return 'Currently full, please try again later';
    }
    if (sessionType === 'Coding Challenge') {
      return 'Challenge Me';
    }
    return 'Register';
  };

  return (
    <>
      {ezmeral ? (
        <CardWrapper
          pad="large"
          justify="between"
          background={backgroundColor}
          round="medium"
          overflow="hidden"
        >
          <Box direction="column">
            <Box direction="column">
              <Heading margin={{ vertical: 'small' }} level={3}>
                {title}
              </Heading>
            </Box>
            <Box>
              <Text
                margin={{ bottom: 'large' }}
                size={size === 'small' ? 'large' : 'xlarge'}
              >
                {desc}
              </Text>
            </Box>
          </Box>
          <Box direction="row" gap="medium">
            <Box direction="row" gap="medium">
              <Button
                alignSelf="start"
                href={sessionLink}
                target="_blank"
                rel="noreferrer noopener"
                label={
                  <Box pad="xsmall">
                    <Text color="text-strong">Learn more</Text>
                  </Box>
                }
                secondary
              />
            </Box>
          </Box>
        </CardWrapper>
      ) : (
        <CardWrapper
          justify="between"
          background={backgroundColor}
          round="xsmall"
          overflow="hidden"
        >
          <Box
            pad={{
              top: size !== 'large' ? 'large' : 'medium',
              horizontal: 'large',
            }}
            background={hover ? '#FFFFFF' : '#00000080'}
            onMouseEnter={() => setHover(true)}
            onFocus={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onBlur={() => setHover(false)}
            height="70%"
            ref={cardRef}
          >
            <Box direction="column">
              {!hover ? (
                <Box direction="column" height={`${cardTopSectionHeight}px`}>
                  {popular && (
                    <ContrastLayer
                      background="background-contrast"
                      width="fit-content"
                      pad="xxsmall"
                      round="xsmall"
                    >
                      <Text
                        color="#FF8300"
                        size="small"
                        margin={{ vertical: '3px', horizontal: '12px' }}
                      >
                        Popular
                      </Text>
                    </ContrastLayer>
                  )}
                  <Heading level={4} margin={{ bottom: 'small' }}>
                    {title}
                  </Heading>
                  {(avatar || presenter || role) && (
                    <Box gap="small" direction="row">
                      {avatar ? (
                        <Avatar src={avatar} />
                      ) : (
                        <Avatar src="/img/SpeakerImages/defaultAvatar.svg" />
                      )}
                      <Box justify="center">
                        <Text>{presenter}</Text>
                        <Text>{role}</Text>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box height={`${cardTopSectionHeight}px`}>
                  <Box overflow={{ horizontal: 'hidden', vertical: 'scroll' }}>
                    <Heading level={5} margin={{ top: 'xsmall' }}>
                      {title}
                    </Heading>
                    <Text
                      margin={{ bottom: 'large' }}
                      size={size === 'small' ? 'small' : 'medium'}
                    >
                      {desc}
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            margin={{ top: 'medium', bottom: 'medium', horizontal: 'large' }}
          >
            <Box direction="row" gap={size === 'small' ? 'xsmall' : 'medium'}>
              {workshopList &&
                workshopList.map((workshop) => (
                  <Box key={workshop.workshopLink}>
                    <Button
                      href={workshop.workshopLink}
                      key={workshop.workshopLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      alignSelf="start"
                      label={
                        <Box pad="xsmall">
                          <Text color="text-strong" size={textSize}>
                            {' '}
                            Register {workshop.workshopID}
                          </Text>
                        </Box>
                      }
                      secondary
                    />
                  </Box>
                ))}
              {(sessionType === 'Coding Challenge' ||
                sessionType === 'Workshops-on-Demand') && (
                <Box>
                  <Button
                    onClick={() => setSignupLayer(true)}
                    disabled={disabled}
                    alignSelf="start"
                    label={
                      <Box pad="xsmall">
                        <Text color="text-strong" size={textSize}>
                          {registerButtonStatus(disabled)}
                        </Text>
                      </Box>
                    }
                    secondary
                  />
                </Box>
              )}
              {sessionType === 'Coding Challenge' ||
              sessionType === 'Workshops-on-Demand' ? (
                // <Link to={`${sessionLink}`}>
                <Button
                  alignSelf="start"
                  href={sessionLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  label={
                    <Box pad="xsmall">
                      <Text color="text-strong" size={textSize}>
                        Learn more
                      </Text>
                    </Box>
                  }
                />
              ) : (
                // </Link>
                <Box direction="row" gap="medium">
                  <Button
                    alignSelf="start"
                    href={sessionLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    label={
                      <Box pad="xsmall">
                        <Text color="text-strong" size={textSize}>
                          Learn more
                        </Text>
                      </Box>
                    }
                  />
                  {sessionType === 'Game Challenge' && (
                    <Button
                      alignSelf="start"
                      href="https://enterpriseaccelerator.hpe.com/terms-and-conditions"
                      target="_blank"
                      rel="noreferrer noopener"
                      label={
                        <Box pad="xsmall">
                          <Text color="text-strong" size={textSize}>
                            Terms & Conditions
                          </Text>
                        </Box>
                      }
                      secondary
                    />
                  )}
                </Box>
              )}
              <DropButton
                dropAlign={{ top: 'bottom', right: 'right' }}
                dropContent={
                  <Box pad="small">
                    <Share workshopId={replayId} workshop />
                  </Box>
                }
                alignSelf="start"
                margin={{ left: 'auto' }}
                icon={<ShareOption />}
                reverse
                gap="xsmall"
                label={
                  size !== 'small' && (
                    <Box pad="xsmall">
                      <Text color="text-strong">Share</Text>
                    </Box>
                  )
                }
              />
            </Box>
            {signupLayer && (
              <SignupLayer
                formData={formData}
                setFormData={handlechange}
                setLayer={setSignupLayer}
                setSuccess={setSuccessLayer}
                title={title}
                size={size}
                sessionType={sessionType}
                duration={duration}
                userInfo={userDetail}
              />
            )}
            {successLayer && (
              <SuccessLayer
                setLayer={setSuccessLayer}
                name={formData.name}
                size={size}
                title={title}
                email={formData.email}
                // reset={resetFormData}
                sessionType={sessionType}
              />
            )}
          </Box>
        </CardWrapper>
      )}
    </>
  );
};
ScheduleCard.propTypes = {
  avatar: PropTypes.string,
  desc: PropTypes.string,
  DBid: PropTypes.number,
  notebook: PropTypes.string,
  presenter: PropTypes.string,
  role: PropTypes.string,
  sessionLink: PropTypes.string,
  sessionType: PropTypes.string,
  title: PropTypes.string,
  workshopList: PropTypes.array,
  location: PropTypes.string,
  ezmeral: PropTypes.bool,
  replayId: PropTypes.number,
  duration: PropTypes.number,
  popular: PropTypes.bool,
};
export default ScheduleCard;
