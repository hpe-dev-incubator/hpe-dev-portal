/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
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
import { Menu, Search, FormUp, FormDown } from 'grommet-icons';
import styled from 'styled-components';
import { AppContext } from '../../providers/AppProvider';
import { ButtonLink } from '../Link';
import { UserMenu } from './UserMenu';

const HEADER_TEXT_COLOR = '#3e4550';
const HEADER_CHEVRON_COLOR = '#676767';

const MainHeader = styled(GrommetHeader)`
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  min-height: 80px;
`;

const HeaderOuter = styled(Box)`
  width: 100%;
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

const MobileMainRow = styled(Box)`
  min-height: 70px;
  border-bottom: 1px solid #e7e9eb;
`;

const MobileActions = styled(Box)`
  gap: 16px;
`;

const MobileSearchIconLink = styled(ButtonLink)`
  && {
    display: inline-flex;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    padding: 0;
    align-items: center;
    justify-content: center;
    color: #000000;
  }
`;

const MobileMenuButton = styled(Button)`
  && {
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    padding: 0;
    border: none;
    border-radius: 0;
    color: #01a982;
  }

  && > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenuPanel = styled(Box)`
  width: 100vw;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  background: #f2f2f2;
`;

const MobileBrandLinkContent = styled(Box)`
  gap: 12px;
`;

const MobileBrandLogo = styled.img`
  width: 90px;
  height: 26px;
  display: block;
  object-fit: contain;
`;

const MobileBrandText = styled.span`
  color: #2f3a48;
  font-size: 24px;
  line-height: 1;
  font-weight: 500;
`;

const MobileAccordionSection = styled(Box)`
  width: 100%;
`;

const MobileSubItemsContainer = styled(Box)`
  width: 100%;
  background: #ffffff;
  max-height: 280px;
  overflow-y: auto;
`;

const MobileNavStack = styled(Box)`
  padding: 0 32px;
`;

const MobileNavParentButton = styled.button`
  width: 100%;
  min-height: 56px;
  border: none;
  border-bottom: 1px solid #d4d8db;
  background: transparent;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #292d3a;
  font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
`;

const MobileNavRowLink = styled(ButtonLink)`
  && {
    width: 100%;
    min-height: 56px;
    border-bottom: 1px solid #d4d8db;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: #f2f2f2;
    color: #292d3a;
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 17px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  && > span {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const MobileSubNavRowLink = styled(ButtonLink)`
  && {
    width: 100%;
    min-height: 50px;
    border-bottom: 1px solid #e7e9eb;
    border-radius: 0;
    display: flex;
    align-items: center;
    padding: 0 24px 0 32px;
    background: #ffffff;
    color: #3e4550;
    font-family: 'HPE Graphik', 'MetricHPE', 'Arial', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
  }

  && > span {
    display: flex;
    align-items: center;
  }
`;

const MobilePrimaryLabel = styled.span`
  color: #292d3a;
`;

function Header() {
  const { data, user: userDetail } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({
    topics: false,
    greenlake: false,
    products: false,
    opensource: false,
  });

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileExpanded({
      topics: false,
      greenlake: false,
      products: false,
      opensource: false,
    });
  };

  const toggleMobileSection = (key) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
  const mobilePrimaryLinks = [
    { key: 'blog', label: 'Blog', to: '/blog' },
    { key: 'events', label: 'Events', to: '/events' },
    { key: 'training', label: 'Training', to: '/skillup' },
    { key: 'community', label: 'Join the Community', to: '/community' },
  ];

  const mobileTopicsChildren = [
    ...((topics || []).map((t, index) => ({
      key: `topic-${index}`,
      label: t.node.frontmatter.title,
      to: `/topic${t.node.fields.slug}`,
    })) || []),
    { key: 'topic-all', label: 'All Topics', to: '/topics' },
  ];

  const mobileGreenlakeChildren = (greenlake || []).map((item, index) => ({
    key: `greenlake-${index}`,
    label: item.node.frontmatter.title,
    to: `/greenlake${item.node.fields.slug}`,
  }));

  const mobileProductsChildren = [
    { key: 'products-all', label: 'All Products', to: '/platforms' },
    ...((platforms || []).map((item, index) => ({
      key: `platform-${index}`,
      label: item.node.frontmatter.title,
      to: `/platform${item.node.fields.slug}`,
    })) || []),
  ];

  const mobileOpenSourceChildren = [
    { key: 'opensource-all', label: 'All Open Source', to: '/opensource' },
    ...((opensource || []).map((item, index) => {
      const s = item.node.fields.slug.toLowerCase();
      return {
        key: `opensource-${index}`,
        label: item.node.frontmatter.title,
        to: `/platform${s}home`,
      };
    }) || []),
  ];

  const mobileExpandableSections = [
    {
      key: 'topics',
      label: 'Topics',
      children: mobileTopicsChildren,
    },
    {
      key: 'greenlake',
      label: 'HPE GreenLake cloud',
      children: mobileGreenlakeChildren,
    },
    {
      key: 'products',
      label: 'Products',
      children: mobileProductsChildren,
    },
    {
      key: 'opensource',
      label: 'OpenSource',
      children: mobileOpenSourceChildren,
    },
  ];

  return (
    <HeaderOuter>
      <MainHeader
        align={size === 'small' ? undefined : 'center'}
        justify={size === 'small' ? undefined : 'between'}
        pad={
          size === 'small'
            ? { horizontal: '0', vertical: '0' }
            : { horizontal: '160px', vertical: '0' }
        }
      >
        {size === 'small' ? (
          <Box width="100%">
            <MobileMainRow
              direction="row"
              align="center"
              justify="between"
              pad={{ horizontal: '32px', vertical: '20px' }}
            >
              <ButtonLink
                label={
                  <MobileBrandLinkContent direction="row" align="center">
                    <MobileBrandLogo src="/img/home/HPE%20Logo.png" alt="HPE" />
                    <MobileBrandText>Developer</MobileBrandText>
                  </MobileBrandLinkContent>
                }
                to="/"
              />

              <MobileActions direction="row" align="center">
                <MobileSearchIconLink
                  to="/search"
                  icon={<Search size="24px" />}
                  aria-label="Search"
                />

                <MobileMenuButton
                  icon={<Menu size="24px" color="#01a982" />}
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                />
              </MobileActions>
            </MobileMainRow>

            {isMobileMenuOpen && (
              <MobileMenuPanel>
                {mobileExpandableSections.map((section) => (
                  <MobileAccordionSection key={section.key}>
                    <MobileNavParentButton
                      type="button"
                      onClick={() => toggleMobileSection(section.key)}
                    >
                      <span>{section.label}</span>
                      {mobileExpanded[section.key] ? (
                        <FormUp size="18px" color="#01a982" />
                      ) : (
                        <FormDown size="18px" color="#b1b9be" />
                      )}
                    </MobileNavParentButton>

                    {mobileExpanded[section.key] && (
                      <MobileSubItemsContainer>
                        {section.children.map((child) => (
                          <MobileSubNavRowLink
                            key={child.key}
                            label={child.label}
                            to={child.to}
                            onClick={closeMobileMenu}
                          />
                        ))}
                      </MobileSubItemsContainer>
                    )}
                  </MobileAccordionSection>
                ))}

                {mobilePrimaryLinks.map((item) => (
                  <MobileNavRowLink
                    key={item.key}
                    to={item.to}
                    onClick={closeMobileMenu}
                    label={
                      <MobilePrimaryLabel>{item.label}</MobilePrimaryLabel>
                    }
                  />
                ))}
              </MobileMenuPanel>
            )}
          </Box>
        ) : (
          <>
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
            <Box flex="shrink" overflow="visible" pad="2px">
              <Nav direction="row" gap="none">
                {navLinks.map((l, index) => (
                  <Box key={index} flex={false}>
                    {l}
                  </Box>
                ))}
              </Nav>
            </Box>
          </>
        )}
        {userDetail && <UserMenu userInfo={userDetail} />}
      </MainHeader>
      {/* <iframe
        title="cookie-session"
        ref={iframeRef}
        id="iframe"
        src="https://origin-qa-www-hpe-com.ext.hpe.com/us/en/service-pages/hfws-cookie.html"
        style={{ display: 'none' }}
      /> */}
    </HeaderOuter>
  );
}

export default Header;
