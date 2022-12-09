/* eslint-disable max-len */
import React, { useContext } from 'react';
import {
  Box,
  DropButton,
  Header as GrommetHeader,
  Nav,
  ResponsiveContext,
} from 'grommet';
import { Menu, Search, FormDown } from 'grommet-icons';
import styled from 'styled-components';
import { AppContext } from '../../providers/AppProvider';
import { ButtonLink } from '..';

const TextAlignLeft = styled(Box)`
  & > a {
    text-align: left;
    font-weight: 400;
    padding-right: 30px;
  }
`;

function Header() {
  const { data } = useContext(AppContext);
  const platforms = data?.platform?.edges;
  const opensource = data?.opensource?.edges;
  const greenlake = data?.greenlake?.edges;

  const GreenLakeButtonLinks = ({ column }) => {
    const leftColumn = greenlake.filter((gl, index) => index % 2 === 0);
    const rightColumn = greenlake.filter((gl, index) => index % 2);
    const greenlakeColumn = column === 'left' ? leftColumn : rightColumn;

    return greenlakeColumn.map((gl, index) => {
      const { slug } = gl.node.fields;
      const { title } = gl.node.frontmatter;

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
            label="All Green Lake"
            to="/platform/hpe-greenlake/home"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          />
          <Box direction="row">
            <TextAlignLeft>
              <GreenLakeButtonLinks column="left" />
            </TextAlignLeft>
            <TextAlignLeft>
              <GreenLakeButtonLinks column="right" />
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
    <DropButton
      label="Our Products"
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
    // <ButtonLink
    //   key="euc"
    //   label="Explore Use Cases"
    //   to="/use-cases"
    //   alignSelf="start"
    // />,
    <ButtonLink align="start" key="yr" label="Your Role" to="/role" />,
    <ButtonLink align="start" key="ev" label="Events" to="/events" />,
    <ButtonLink align="start" key="su" label="Skill Up" to="/skillup" />,
    <ButtonLink
      align="start"
      key="bl"
      label="Blog"
      to="/blog"
      state={{ state: { isBlogHeaderClicked: true } }}
    />,
    <ButtonLink align="start" key="cm" label="Community" to="/community" />,
    // <ButtonLink
    //   align="start"
    //   key="os"
    //   label="SignIn"
    //   to={`https://www-prod-cockpit-west.ext.hpe.com/oauth2/authorization/hpe-okta?redirectUri=${window.location.origin}`}
    // />,
  ];
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
    </GrommetHeader>
  );
}

export default Header;
