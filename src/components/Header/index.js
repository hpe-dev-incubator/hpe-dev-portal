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
import { ButtonLink } from '..';

const TextAlignLeft = styled(Box)`
  & > a {
    text-align: left;
    font-weight: 400;
    padding-right: 30px;
  }
`;

function Header() {
  const size = useContext(ResponsiveContext);
  const navLinks = [
    <ButtonLink key="os" label="Open Source" to="/opensource" />,
    <DropButton
      label="Our Platforms"
      dropAlign={{ top: 'bottom', left: 'left' }}
      icon={<FormDown />}
      reverse
      dropContent={
        <TextAlignLeft>
          <ButtonLink
            key="pl"
            label="All Platforms"
            to="/platforms"
            state={{ state: { isPlatformHeaderClicked: true } }}
            alignSelf="start"
            fill="horizontal"
          />
          <Box direction="row">
            <TextAlignLeft>
              <ButtonLink
                key="pl-hecp"
                label="HPE Ezmeral Runtime"
                to="/platform/hpe-ezmeral-runtime/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hedf"
                label="HPE Ezmeral Data Fabric"
                to="/platform/hpe-ezmeral-data-fabric/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hgl"
                label="HPE GreenLake"
                to="/platform/hpe-greenlake/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-ssp"
                label="SPIFFE and SPIRE Projects"
                to="/platform/spiffe-and-spire-projects/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-c"
                label="Chapel"
                to="/platform/chapel/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-g"
                label="Grommet"
                to="/platform/grommet/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-ha"
                label="HPE Alletra"
                to="/platform/hpe-alletra/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hdlc"
                label="HPE Deep Learning Cookbook"
                to="/platform/hpe-deep-learning-cookbook/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-dai"
                label="Determined AI"
                to="/platform/determined-ai/home/"
                alignSelf="start"
                fill="horizontal"
              />
            </TextAlignLeft>
            <TextAlignLeft>
              <ButtonLink
                key="pl-ss"
                label="SmartSim"
                to="/platform/smartsim/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-adh"
                label="Aruba Developer Hub"
                to="/platform/aruba/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-h3p"
                label="HPE 3PAR and Primera"
                to="/platform/hpe-3par-and-primera/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hns"
                label="HPE Nimble Storage"
                to="/platform/hpe-nimble-storage/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hov"
                label="HPE OneView"
                to="/platform/hpe-oneview/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hogd"
                label="HPE OneView Global Dashboard"
                to="/platform/hpe-oneview-global-dashboard/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-hs"
                label="HPE SimpliVity"
                to="/platform/hpe-simplivity/home/"
                alignSelf="start"
                fill="horizontal"
              />
              <ButtonLink
                key="pl-ira"
                label="iLO RESTful API"
                to="/platform/ilo-restful-api/home/"
                alignSelf="start"
                fill="horizontal"
              />
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
    // <ButtonLink
    //   key="wyr"
    //   label="What's Your Role"
    //   to="/role"
    //   alignSelf="start"
    // />,
    <ButtonLink key="ev" label="Events" to="/events" />,
    <ButtonLink key="su" label="Skill Up" to="/skillup" />,
    <ButtonLink
      key="bl"
      label="Blog"
      to="/blog"
      state={{ state: { isBlogHeaderClicked: true } }}
    />,
    <ButtonLink key="cm" label="Community" to="/community" />,
  ];

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
      <ButtonLink
        align="start"
        to="/search"
        icon={<Search />}
        label="Search"
        reverse
      />
    </GrommetHeader>
  );
}
export default Header;
