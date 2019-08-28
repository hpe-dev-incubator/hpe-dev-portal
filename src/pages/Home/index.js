import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Text, Image } from 'grommet';

import { Layout, SEO, Card, CardHeading, Description } from '../../components';

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
        <Box flex overflow="auto" gap="medium" pad="medium">
          <Box flex={false} direction="row-responsive" wrap>
            {/* Conditionally render all tiles */}
            {homeTile && (
              <Card
                direction="row"
                width="large"
                gap="large"
                category={homeTile.category}
              >
                <Image src={homeTile.image} />
                <Box>
                  <CardHeading level={1}>{homeTile.title}</CardHeading>
                  <Description>{homeTile.description}</Description>
                </Box>
              </Card>
            )}
            <Card category={researchTile.category}>
              <CardHeading>{researchTile.title}</CardHeading>
              <Description>{researchTile.description}</Description>
            </Card>
            <Card width="medium" category={designTile.category}>
              <Box align="start" gap="medium">
                <Image src={designTile.image} />
                <Box>
                  <CardHeading>{designTile.title}</CardHeading>
                  <Description>{designTile.description}</Description>
                </Box>
              </Box>
            </Card>
            <Card width="medium" gap="large" category={eventTile.category}>
              <Image src={eventTile.image} />
              <Box justify="center" align="center">
                <CardHeading>{eventTile.title}</CardHeading>
                <Description>{eventTile.description}</Description>
              </Box>
            </Card>
            <Card width="large" gap="large" category={researchTileBig.category}>
              <Image src={researchTileBig.image} />
              <Box align="center">
                <CardHeading>{researchTileBig.title}</CardHeading>
                <Description>{researchTileBig.description}</Description>
              </Box>
            </Card>
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
                <CardHeading>{communityTile.title}</CardHeading>
                <Description>{communityTile.description}</Description>
              </Box>
              <Image src={communityTile.image} />
            </Card>
            <Card width="medium" gap="large" category={openSourceTile.category}>
              <Box align="center">
                <CardHeading>{openSourceTile.title}</CardHeading>
                <Description>{openSourceTile.description}</Description>
              </Box>
              <Image src={openSourceTile.image} />
            </Card>
            <Card
              width="medium"
              align="start"
              gap="medium"
              category={developTile.category}
            >
              <Image src={developTile.image} />
              <Box>
                <CardHeading>{developTile.title}</CardHeading>
                <Description>{developTile.description}</Description>
              </Box>
            </Card>
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
