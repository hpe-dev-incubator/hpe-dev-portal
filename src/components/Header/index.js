import React, { useContext } from 'react';
import {
  Box,
  DropButton,
  Header as GrommetHeader,
  Nav,
  ResponsiveContext,
} from 'grommet';
import { useStaticQuery, graphql } from 'gatsby';
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

  const data = useStaticQuery(graphql`
    query NonPageQuery {
      allMarkdownRemark(
        filter: {
          fields: {
            sourceInstanceName: { eq: "platform" }
            slug: { regex: "//home/$/" }
          }
        }
        sort: { fields: [frontmatter___priority] }
      ) {
        edges {
          node {
            id
            fields {
              slug
              sourceInstanceName
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);

  const platforms = data.allMarkdownRemark.edges;

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
              <PlatformButtonLinks column='left' />
            </TextAlignLeft>
            <TextAlignLeft>
              <PlatformButtonLinks column='right'/>
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
