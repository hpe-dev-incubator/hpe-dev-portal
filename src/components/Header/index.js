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
import { ButtonLink } from '..';
import { UserMenu } from './UserMenu';

const { GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT } = process.env;
const { GATSBY_COCKPIT_HPE_OAUTH } = process.env;

// const { GATSBY_CLIENT_ID } = process.env;
// const { GATSBY_CLIENT_OAUTH } = process.env;

const TextAlignLeft = styled(Box)`
  & > a {
    text-align: left;
    font-weight: 400;
    padding-right: 30px;
  }
`;

function Header() {
  const { data, user: userDetail } = useContext(AppContext);

  const platforms = data?.platform?.edges;
  const opensource = data?.opensource?.edges;
  const greenlake = data?.greenlake?.edges;

  const GreenLakeButtonLinks = ({ column }) => {
    /* const leftColumn = greenlake.filter((gl, index) => index % 2 === 0); */
    const leftColumn = greenlake;
    const rightColumn = greenlake.filter((gl, index) => index % 2);

    const externalLinks = [
      {
        title: 'HPE GreenLake API Portal',
        slug: 'https://developer.greenlake.hpe.com/',
      },
      {
        title: 'HPE GreenLake Test Drive',
        slug: 'https://testdrive.greenlake.hpe.com/',
      },
    ];

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
=======
    const elColumns = externalLinksColumn.map((el, index) => {
      const { slug, title } = el;
      return (
        <ExternalButtonLink
          key={index}
          label={title}
          to={`${slug}`}
          alignSelf="start"
          fill="horizontal"
        />
      );
    });
    const allLinks = [...elColumns, ...glColumns];
>>>>>>> d50b4f7f (removing the replay table and start shrinking down the content of the web portal)
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

  const handleHPESignIn = () => {
    let redirectURI =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://developer.hpe.com';
    redirectURI +=
      redirectURI.charAt(redirectURI.length - 1) !== '/' ? '/' : '';

    console.log(
      'Sign in URL+++',
      `${GATSBY_COCKPIT_HPE_OAUTH}?redirectUri=${redirectURI}`,
    );
    window.location.href = `${GATSBY_COCKPIT_HPE_OAUTH}?redirectUri=${redirectURI}`;
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
          `${GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/users/github-auth`,
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
    <DropButton
      label="HPE GreenLake"
      align="start"
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={
        <TextAlignLeft>
          <ButtonLink
            key="pl"
            label="HPE GreenLake edge-to-cloud platform"
            to="/greenlake/hpe-greenlake-cloud-platform/home/"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          />
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
    <DropButton
      label="Products"
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
    <DropButton
      label="OpenSource"
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
    <ButtonLink align="start" key="ev" label="Events" to="/events" />,
    <ButtonLink align="start" key="su" label="Skill Up" to="/skillup" />,

    <ButtonLink align="start" key="cm" label="Community" to="/community" />,
  ];

  navLinks.push(
    <ButtonLink
      align="start"
      key="bl"
      label="Blog"
      to="/blog"
      state={{ state: { isBlogHeaderClicked: true } }}
    />,
  );

  if (!userDetail) {
    navLinks.push(
      <Button
        align="start"
        key="os"
        label="SIGN IN"
        secondary
        onClick={handleHPESignIn}
      />,
    );
  }
  if (size === 'small') {
    navLinks.push(
      <ButtonLink
        align="start"
        to="/search"
        icon={<Search />}
        label="Search"
        reverse
      />,
    );
  }

  return (
    <GrommetHeader
      justify="between"
      pad={{ horizontal: 'medium', vertical: 'small' }}
    >
      <Box flex={false}>
        <ButtonLink label="HPE Developer" to="/" />
      </Box>
      {size === 'small' ? (
        <DropButton
          icon={<Menu />}
          dropAlign={{ top: 'bottom' }}
          dropContent={<Nav direction="column">{navLinks}</Nav>}
        />
      ) : (
        <Box flex="shrink" overflow="hidden" pad="2px">
          <Nav direction="row" gap="medium">
            {navLinks.map((l, index) => (
              <Box key={index} flex={false}>
                {l}
              </Box>
            ))}
          </Nav>
        </Box>
      )}
      {size !== 'small' && (
        <ButtonLink
          align="start"
          to="/search"
          icon={<Search />}
          label="Search"
          reverse
        />
      )}
      {userDetail && <UserMenu userInfo={userDetail} />}

      {/* <iframe
        title="cookie-session"
        ref={iframeRef}
        id="iframe"
        src="https://origin-qa-www-hpe-com.ext.hpe.com/us/en/service-pages/hfws-cookie.html"
        style={{ display: 'none' }}
      /> */}
    </GrommetHeader>
  );
}

export default Header;
