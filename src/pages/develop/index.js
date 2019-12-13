/* eslint-disable max-len */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { graphql, Link as GatsbyLink } from 'gatsby';
import { Box, Heading as GrommetHeading, Image, Text } from 'grommet';

import { Layout, Link, SEO } from '../../components';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

const Card = ({ children, ...rest }) => (
  <Box
    margin={{
      left: 'large',
      right: 'large',
    }}
    pad={{
      bottom: 'large',
      top: 'large',
    }}
    gap="medium"
    border={{
      side: 'top',
      color: 'light-2',
      size: 'medium',
    }}
    justify="center"
    {...rest}
  >
    {children}
  </Box>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

const Heading = ({ children, ...rest }) => (
  <GrommetHeading
    level={2}
    size="large"
    margin={{ top: 'none', bottom: 'xsmall' }}
    {...rest}
  >
    {children}
  </GrommetHeading>
);

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

const Heading3 = ({ children, ...rest }) => (
  <GrommetHeading
    level={3}
    size="large"
    margin={{ top: 'none', bottom: 'none' }}
    {...rest}
  >
    {children}
  </GrommetHeading>
);

Heading3.propTypes = {
  children: PropTypes.node.isRequired,
};

const Description = ({ children, ...rest }) => (
  <Text size="large" color="dark-3" {...rest}>
    {children}
  </Text>
);

Description.propTypes = {
  children: PropTypes.node.isRequired,
};

const Platform = ({ children, image, link, ...rest }) => (
  <NavLink to={link}>
    <Box width="288px" gap="small" pad={{ top: 'medium' }} {...rest}>
      <Box background="light-2" width="288px" height="288px">
        {image && <Image fit="contain" src={image} />}
      </Box>
      {children}
    </Box>
  </NavLink>
);

Platform.propTypes = {
  children: PropTypes.node.isRequired,
  image: PropTypes.string,
  link: PropTypes.string,
};

class Develop extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const platforms = data.allMarkdownRemark.edges;

    return (
      <Layout title={siteTitle}>
        <SEO title="Develop" />
        <Box flex overflow="auto" gap="medium" pad="small">
          <Box flex={false} direction="row-responsive" wrap>
            <Box direction="row-responsive">
              <Box>
                <Card border={{ size: '0px' }}>
                  <Heading size="large" level={1}>
                    <Image src="/img/develop.png" margin={{ right: 'large' }} />
                    Develop
                  </Heading>
                  <Description size="xlarge">
                    We provide the dev tools and services to make you successful
                    in the Enterprise
                  </Description>
                  <Box direction="row-responsive" gap="medium">
                    <Link to="/platforms" color="neutral-4">
                      Platforms
                    </Link>
                    <Link to="/devops" color="neutral-4">
                      DevOps
                    </Link>
                    <Link to="/documentation" color="neutral-4">
                      Documentation
                    </Link>
                    <Link to="/videos" color="neutral-4">
                      Videos
                    </Link>
                    <Link to="/downloads" color="neutral-4">
                      Downloads
                    </Link>
                  </Box>
                </Card>

                <Card>
                  <Heading>Attack the IT Monster</Heading>
                  <Description>
                    Play the game, learn the ropes of enterprise IT and how to
                    use our platforms in the process
                  </Description>
                </Card>
              </Box>

              <Card border={{ size: '0px' }}>
                <Image src="/img/itmonster.png" />
              </Card>
            </Box>

            <Box direction="row-responsive">
              <Card>
                <Heading>HPE Developer Utility</Heading>
                <Description>
                  Install the latest HPE Platform SDK's so you can build apps,
                  test features and play.
                </Description>
              </Card>

              <Card>
                <Heading>HPE Greenlake Beta</Heading>
                <Description>
                  Run the HPE Developer Utility to download the latest Greenlake
                  beta. As new betas become available you will receive a
                  notification and can install them from the Software Update
                  pane in your dev environment.
                </Description>
              </Card>
            </Box>

            <Card>
              <Heading>Platforms</Heading>
              <Description>
                Get a peek at some of the new technologies we're excited about
                and think you will be too.
              </Description>
              <Box direction="row" gap="medium" wrap>
                {platforms &&
                  platforms.map(({ node }) => (
                    <Platform
                      image={node.frontmatter.image}
                      key={node.id}
                      link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
                    >
                      <Box>
                        <Heading3>{node.frontmatter.title}</Heading3>
                        <Text color="neutral-4" size="small">
                          {node.frontmatter.version}
                        </Text>
                      </Box>
                      <Description>{node.frontmatter.description}</Description>
                    </Platform>
                  ))}
              </Box>
              <Link to="/platforms" label="See all Platforms >" />
            </Card>
          </Box>
          {/* main body */}
        </Box>
      </Layout>
    );
  }
}

Develop.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string,
              version: PropTypes.string,
              description: PropTypes.string,
              image: PropTypes.string,
              frontpage: PropTypes.bool,
              priority: PropTypes.number,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
};

export default Develop;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "platform" } }
        frontmatter: { frontpage: { eq: true } }
      }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            version
            description
            image
            frontpage
            priority
          }
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
        }
      }
    }
  }
`;
