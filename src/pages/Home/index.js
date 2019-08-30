import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Text, Image } from 'grommet';

import { Layout, SEO, Card } from '../../components';

class Home extends React.Component {
  render() {
    const { data } = this.props;
    const { title, content } = data.markdownRemark.frontmatter;
    const siteTitle = data.site.siteMetadata.title;
    const [
      homeTile,
      researchTile,
      designTile,
      eventTile,
      researchTileBig,
      communityTile,
      openSourceTile,
      developTile,
    ] = content;
    return (
      <Layout title={siteTitle}>
        <SEO title={title} />
        <Box flex overflow="auto" gap="medium" pad="small">
          <Box flex={false} direction="row-responsive" wrap>
            {homeTile && (
              <Card
                direction="row"
                width="large"
                gap="large"
                category={homeTile.category}
              >
                <Image src={homeTile.image} />
                <Box>
                  <Card.Title level={1}>{homeTile.title}</Card.Title>
                  <Card.Description>{homeTile.description}</Card.Description>
                </Box>
              </Card>
            )}
            {researchTile && (
              <Card category={researchTile.category}>
                <Card.Title>{researchTile.title}</Card.Title>
                <Card.Description>{researchTile.description}</Card.Description>
              </Card>
            )}
            {designTile && (
              <Card width="medium" category={designTile.category}>
                <Box align="start" gap="medium">
                  <Image src={designTile.image} />
                  <Box>
                    <Card.Title>{designTile.title}</Card.Title>
                    <Card.Description>
                      {designTile.description}
                    </Card.Description>
                  </Box>
                </Box>
              </Card>
            )}
            {eventTile && (
              <Card width="medium" gap="large" category={eventTile.category}>
                <Image src={eventTile.image} />
                <Box justify="center" align="center">
                  <Card.Title>{eventTile.title}</Card.Title>
                  <Card.Description>{eventTile.description}</Card.Description>
                </Box>
              </Card>
            )}
            {researchTileBig && (
              <Card
                width="large"
                gap="large"
                category={researchTileBig.category}
              >
                <Image src={researchTileBig.image} />
                <Box align="center">
                  <Card.Title>{researchTileBig.title}</Card.Title>
                  <Card.Description>
                    {researchTileBig.description}
                  </Card.Description>
                </Box>
              </Card>
            )}
            {communityTile && (
              <Card
                width="medium"
                align="start"
                gap="medium"
                category={communityTile.category}
              >
                <Box>
                  <Text size="medium" color="dark-3">
                    May 23, 2019
                  </Text>
                  <Card.Title>{communityTile.title}</Card.Title>
                  <Card.Description>
                    {communityTile.description}
                  </Card.Description>
                </Box>
                <Image src={communityTile.image} />
              </Card>
            )}
            {openSourceTile && (
              <Card
                width="medium"
                gap="large"
                category={openSourceTile.category}
              >
                <Box align="center">
                  <Card.Title>{openSourceTile.title}</Card.Title>
                  <Card.Description>
                    {openSourceTile.description}
                  </Card.Description>
                </Box>
                <Image src={openSourceTile.image} />
              </Card>
            )}
            {developTile && (
              <Card
                width="medium"
                align="start"
                gap="medium"
                category={developTile.category}
              >
                <Image src={developTile.image} />
                <Box>
                  <Card.Title>{developTile.title}</Card.Title>
                  <Card.Description>{developTile.description}</Card.Description>
                </Box>
              </Card>
            )}
          </Box>
        </Box>
      </Layout>
    );
  }
}

Home.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        intro: PropTypes.string.isRequired,
        heroBg: PropTypes.string.isRequired,
        content: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            image: PropTypes.string,
            category: PropTypes.string,
          }),
        ),
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Home;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: "/" } }) {
      excerpt
      frontmatter {
        title
        intro
        heroBg
        content {
          image
          title
          description
          category
        }
      }
    }
  }
`;
