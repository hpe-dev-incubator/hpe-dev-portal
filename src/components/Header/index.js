/* eslint-disable max-len */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  DropButton,
  Header as GrommetHeader,
  Nav,
  // Menu as HeaderMenu,
  ResponsiveContext,
} from 'grommet';
import { Menu, Search, FormDown } from 'grommet-icons';
import styled from 'styled-components';
import { AppContext } from '../../providers/AppProvider';
import { ButtonLink } from '../Link';
import { UserMenu } from './UserMenu';

const HEADER_TEXT_COLOR = '#3e4550';
const HEADER_CHEVRON_COLOR = '#676767';

const MainHeader = styled(GrommetHeader)`
  min-height: 80px;
`;

const TextAlignLeft = styled(Box)`
  & > a {
    text-align: left;
    font-weight: 400;
    padding-right: 30px;
  }
`;

const BrandLinkContent = styled(Box)`
  gap: 12px;
`;

const BrandLogo = styled.img`
  width: 104px;
  height: 30px;
  display: block;
  object-fit: contain;
`;

const BrandLabel = styled.span`
  color: #2f3a48;
  font-size: 24px;
  line-height: 1;
  font-weight: 500;
`;

const HeaderItemLabel = styled.span`
  color: ${HEADER_TEXT_COLOR};
  font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: -0.005em;
  line-height: 1;
`;

const HeaderNavLink = styled(ButtonLink)`
  && {
    display: inline-flex;
    align-items: center;
    height: 38px;
    border-radius: 100px;
    padding: 0 16px;
    color: ${HEADER_TEXT_COLOR};
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: -0.005em;
    line-height: 1;
  }

  && > span {
    display: inline-flex;
    align-items: center;
  }
`;

const HeaderDropButton = styled(DropButton)`
  && {
    display: inline-flex;
    align-items: center;
    height: 38px;
    border-radius: 100px;
    padding: 0 8px 0 16px;
    gap: 4px;
    color: ${HEADER_TEXT_COLOR};
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: -0.005em;
    line-height: 1;
  }

  && > span {
    display: inline-flex;
    align-items: center;
  }

  && svg {
    stroke: ${HEADER_CHEVRON_COLOR};
  }
`;

const HeaderSearchLink = styled(ButtonLink)`
  && {
    display: inline-flex;
    align-items: center;
    height: 38px;
    border-radius: 100px;
    padding: 0 16px;
    color: ${HEADER_TEXT_COLOR};
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: -0.005em;
    line-height: 1;
  }

  && > span {
    display: inline-flex;
    align-items: center;
  }
`;

const HeaderSearchIconLink = styled(ButtonLink)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    width: 24px;
    min-width: 24px;
    padding: 0;
    margin-left: 24px;
    color: ${HEADER_TEXT_COLOR};
  }
`;

const JoinCommunityButton = styled(ButtonLink)`
  && {
    align-items: center;
    border-radius: 9999px;
    border: 1px solid #01a982;
    background: transparent;
    color: #292d3a;
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 24px;
  }

  && > span {
    display: inline-flex;
    align-items: center;
  }
`;

function Header() {
  const { data, user: userDetail } = useContext(AppContext);

  const platforms = data?.platform?.edges;
  const opensource = data?.opensource?.edges;
  const greenlake = data?.greenlake?.edges;
  const topics = data?.topic?.edges;

  const GreenLakeButtonLinks = ({ column }) => {
    /* const leftColumn = greenlake.filter((gl, index) => index % 2 === 0); */
    const leftColumn = greenlake;
    const rightColumn = greenlake.filter((gl, index) => index % 2);
    // const externalLinks = [
    //   {
    //     title: 'HPE GreenLake API Portal',
    //     slug: 'https://developer.greenlake.hpe.com/',
    //   },
    //   {
    //     title: 'HPE GreenLake Test Drive',
    //     slug: 'https://testdrive.greenlake.hpe.com/',
    //   },
    // ];

    // const externalLeftColumn = externalLinks.filter(
    //   (el, index) => index % 2 === 0,
    // );
    // const externalRightColumn = externalLinks.filter((el, index) => index % 2);
    // const externalLinksColumn =
    //   column === 'left' ? externalLeftColumn : externalRightColumn;
    const greenlakeColumn = column === 'left' ? leftColumn : rightColumn;

    const glColumns = greenlakeColumn.map((gl, index) => {
      const { slug } = gl.node.fields;
      const { title } = gl.node.frontmatter;

      return (
        <ButtonLink
          key={index}
          label={title}
          to={`/greenlake${slug}`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });

    //  const elColumns = externalLinksColumn.map((el, index) => {
    //  const { slug, title } = el;
    //  return (
    //    <ExternalButtonLink
    //   key={index}
    //   label={title}
    //    to={`${slug}`}
    //   alignSelf="start"
    //    fill="horizontal"
    //   />
    //    );
    // });
    const allLinks = [/* ...elColumns, */ ...glColumns];
    return allLinks;
  };
  // const iframeRef = useRef();

  const PlatformButtonLinks = ({ column }) => {
    const leftColumn = platforms.filter((platform, index) => index % 2 === 0);
    const rightColumn = platforms.filter((platform, index) => index % 2);
    const platformsColumn = column === 'left' ? leftColumn : rightColumn;

    return platformsColumn.map((platform, index) => {
      const { slug } = platform.node.fields;
      const { title } = platform.node.frontmatter;

      return (
        <ButtonLink
          key={index}
          label={title}
          to={`/platform${slug}`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });
  };

  const OpenSourceButtonLinks = ({ column }) => {
    const leftColumn = opensource.filter((os, index) => index % 2 === 0);
    const rightColumn = opensource.filter((os, index) => index % 2);
    const osColumn = column === 'left' ? leftColumn : rightColumn;

    return osColumn.map((os, index) => {
      const { slug } = os.node.fields;
      const s = slug.toLowerCase();
      const { title } = os.node.frontmatter;

      return (
        <ButtonLink
          key={index}
          label={title}
          to={`/platform${s}home`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });
  };

  const TopicDropContent = () => {
    if (!topics || topics.length === 0) return null;
    return (
      <TextAlignLeft>
        {topics.map((t, index) => {
          const { slug } = t.node.fields;
          const { title } = t.node.frontmatter;
          return (
            <ButtonLink
              key={index}
              label={title}
              to={`/topic${slug}`}
              alignSelf="start"
              fill="horizontal"
            />
          );
        })}
        <Box
          border={{ side: 'top', color: 'border' }}
          margin={{ vertical: 'xsmall' }}
        />
        <ButtonLink
          key="all-topics"
          label="All Topics"
          to="/topics"
          alignSelf="start"
          fill="horizontal"
        />
      </TextAlignLeft>
    );
  };

  const handleHPESignIn = () => {
    let redirectURI =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://developer.hpe.com';
    redirectURI +=
      redirectURI.charAt(redirectURI.length - 1) !== '/' ? '/' : '';

    console.log(
      'Sign in URL+++',
      `${process.env.GATSBY_COCKPIT_HPE_OAUTH}?redirectUri=${redirectURI}`,
    );
    window.location.href = `${process.env.GATSBY_COCKPIT_HPE_OAUTH}?redirectUri=${redirectURI}`;
  };
  // const hanldeGitHubSignIn = () => {
  //   window.location.href = `${GATSBY_CLIENT_OAUTH}?scope=user&client_id=${GATSBY_CLIENT_ID}&redirect_uri=${GATSBY_REDIRECT_URI}`;
  // };

  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split('?code=');
      window.history.pushState({}, null, newUrl[0]);
      axios
        .post(
          `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/users/github-auth`,
          {
            code: newUrl[1],
          },
        )
        .then((result) => {
          localStorage.setItem('userInfo', JSON.stringify(result.data));
          window.location.reload();
        });
    }
  }, []);

  // console.log('--user-- Header', userDetail);
  const size = useContext(ResponsiveContext);
  const navLinks = [
    // <ButtonLink align="start" key="os" label="Open Source" to="/opensource" />,
    // <ButtonLink
    //   align="start"
    //   key="os"
    //   label="HPE GreenLake"
    //   to="/platform/hpe-greenlake/home"
    // />,
    <HeaderDropButton
      key="tp"
      label={<HeaderItemLabel>Topics</HeaderItemLabel>}
      align="start"
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={<TopicDropContent />}
    />,
    <HeaderDropButton
      label={<HeaderItemLabel>HPE GreenLake cloud</HeaderItemLabel>}
      align="start"
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={
        <TextAlignLeft>
          {/* <ButtonLink
            key="pl"
            label="HPE GreenLake Platform"
            to="/greenlake/hpe-greenlake-platform/home/"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          /> */}
          <Box direction="row">
            <TextAlignLeft>
              <GreenLakeButtonLinks column="left" />
            </TextAlignLeft>
            {/*             <TextAlignLeft>
              <GreenLakeButtonLinks column="right" />
            </TextAlignLeft> */}
          </Box>
        </TextAlignLeft>
      }
    />,
    <HeaderDropButton
      label={<HeaderItemLabel>Products</HeaderItemLabel>}
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={
        <TextAlignLeft>
          <ButtonLink
            key="pl"
            label="All Products"
            to="/platforms"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          />
          <Box direction="row">
            <TextAlignLeft>
              <PlatformButtonLinks column="left" />
            </TextAlignLeft>
            <TextAlignLeft>
              <PlatformButtonLinks column="right" />
            </TextAlignLeft>
          </Box>
        </TextAlignLeft>
      }
    />,
    <HeaderDropButton
      label={<HeaderItemLabel>OpenSource</HeaderItemLabel>}
      align="start"
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={
        <TextAlignLeft>
          <ButtonLink
            key="pl"
            label="All Open Source"
            to="/opensource"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          />
          <Box direction="row">
            <TextAlignLeft>
              <OpenSourceButtonLinks column="left" />
            </TextAlignLeft>
            <TextAlignLeft>
              <OpenSourceButtonLinks column="right" />
            </TextAlignLeft>
          </Box>
        </TextAlignLeft>
      }
    />,
    // <ButtonLink
    //   key="euc"
    //   label="Explore Use Cases"
    //   to="/use-cases"
    //   alignSelf="start"
    // />,
    // <ButtonLink align="start" key="yr" label="Your Role" to="/role" />,
    <HeaderNavLink
      align="start"
      key="bl"
      label={<HeaderItemLabel>Blog</HeaderItemLabel>}
      to="/blog"
      state={{ state: { isBlogHeaderClicked: true } }}
    />,
    <HeaderNavLink
      align="start"
      key="ev"
      label={<HeaderItemLabel>Events</HeaderItemLabel>}
      to="/events"
    />,
    <HeaderNavLink
      align="start"
      key="su"
      label={<HeaderItemLabel>Training</HeaderItemLabel>}
      to="/skillup"
    />,

    ...(size === 'small'
      ? [
          <HeaderNavLink
            align="start"
            key="cm"
            label={<HeaderItemLabel>Join the Community</HeaderItemLabel>}
            to="/community"
          />,
        ]
      : [
          <JoinCommunityButton
            align="start"
            key="cm"
            label="Join the Community"
            to="/community"
          />,
        ]),
    ...(size !== 'small'
      ? [
          <HeaderSearchIconLink
            align="start"
            key="search-icon"
            to="/search"
            icon={<Search />}
            aria-label="Search"
          />,
        ]
      : []),
  ];

  // if (!userDetail) {
  //   navLinks.push(
  //     <Button
  //       align="start"
  //       key="os"
  //       label="SIGN IN"
  //       secondary
  //       onClick={handleHPESignIn}
  //     />,
  //   );
  // }
  if (size === 'small') {
    navLinks.push(
      <HeaderNavLink
        align="start"
        to="/search"
        icon={<Search />}
        label={<HeaderItemLabel>Search</HeaderItemLabel>}
        reverse
      />,
    );
  }

  return (
    <MainHeader
      align="center"
      justify="between"
      pad={
        size === 'small'
          ? { horizontal: 'medium', vertical: 'small' }
          : { horizontal: '160px', vertical: '0' }
      }
    >
      <Box flex={false}>
        <ButtonLink
          label={
            <BrandLinkContent direction="row" align="center">
              <BrandLogo src="/img/home/HPE%20Logo.png" alt="HPE" />
              <BrandLabel>Developer</BrandLabel>
            </BrandLinkContent>
          }
          to="/"
        />
      </Box>
      {size === 'small' ? (
        <DropButton
          icon={<Menu />}
          dropAlign={{ top: 'bottom', right: 'right' }}
          dropContent={
            <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
              <Nav direction="column">{navLinks}</Nav>
            </Box>
          }
        />
      ) : (
        <Box flex="shrink" overflow="visible" pad="2px">
          <Nav direction="row" gap="none">
            {navLinks.map((l, index) => (
              <Box key={index} flex={false}>
                {l}
              </Box>
            ))}
          </Nav>
        </Box>
      )}
      {userDetail && <UserMenu userInfo={userDetail} />}

      {/* <iframe
        title="cookie-session"
        ref={iframeRef}
        id="iframe"
        src="https://origin-qa-www-hpe-com.ext.hpe.com/us/en/service-pages/hfws-cookie.html"
        style={{ display: 'none' }}
      /> */}
    </MainHeader>
  );
}

export default Header;
