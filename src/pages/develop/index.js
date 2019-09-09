import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading as GrommetHeading, Image, Text, Anchor } from 'grommet';

import { Link, Layout, SEO } from '../../components';

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

const Platform = ({ children, ...rest }) => (
  <Box width="288px" gap="small" pad={{ top: 'medium' }} {...rest}>
    <Box background="light-2" width="288px" height="288px" />
    {children}
  </Box>
);

Platform.propTypes = {
  children: PropTypes.node.isRequired,
};

class Develop extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

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
                    <Link to="/platforms">Platforms</Link>
                    <Link to="/devops">DevOps</Link>
                    <Link to="/documentation">Documentation</Link>
                    <Link to="/videos">Videos</Link>
                    <Link to="/downloads">Downloads</Link>
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
                <Platform>
                  <Box>
                    <Heading3>OneView</Heading3>
                    <Text color="neutral-4" size="small">
                      v 6.01.8964
                    </Text>
                  </Box>
                  <Description>
                    The foundation for a software-defined data center.
                  </Description>
                </Platform>
                <Platform>
                  <Box>
                    <Heading3>Simplivity</Heading3>
                    <Text color="neutral-4" size="small">
                      v 6.01.8964
                    </Text>
                  </Box>
                  <Description>
                    A hyperconverged platform uniting best-in-class data
                    services with the world's bestselling server.
                  </Description>
                </Platform>
                <Platform>
                  <Box>
                    <Heading3>HPE Azure Stack</Heading3>
                    <Text color="neutral-4" size="small">
                      v 6.01.8964
                    </Text>
                  </Box>
                  <Description>
                    Run Azure services on-premise. An integrated hybrid cloud
                    that incorporates compute, storage, and networking.
                  </Description>
                </Platform>
                <Platform>
                  <Box>
                    <Heading3>Nimble</Heading3>
                    <Text color="neutral-4" size="small">
                      v 6.01.8964
                    </Text>
                  </Box>
                  <Description>
                    The Cloud Ready storage platform with Predictive Analytics
                    provides robust APIs for the next generation data center.
                  </Description>
                </Platform>
                <Platform>
                  <Box>
                    <Heading3>iLO</Heading3>
                    <Text color="neutral-4" size="small">
                      v 6.01.8964
                    </Text>
                  </Box>
                  <Description>
                    Simple and automated remote HPE Server management through
                    Redfish.
                  </Description>
                </Platform>
              </Box>
              <Anchor color="brand" label="See all Platforms >" />
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
  }
`;
