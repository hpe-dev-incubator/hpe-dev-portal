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

    return (
      <Layout title={siteTitle}>
        <SEO title={title} />
        <Box flex overflow="auto" gap="medium" pad="medium">
          <Box flex={false} direction="row-responsive" wrap>
            <Card
              direction="row"
              width="large"
              gap="large"
              category={content[0].category}
            >
              <Image src={content[0].image} />
              <Box>
                <CardHeading level={1}>{content[0].title}</CardHeading>
                <Description>{content[0].description}</Description>
              </Box>
            </Card>
            <Card category={content[1].category}>
              <CardHeading>{content[1].title}</CardHeading>
              <Description>{content[1].description}</Description>
            </Card>
            <Card width="medium" category={content[2].category}>
              <Box align="start" gap="medium">
                <Image src={content[2].image} />
                <Box>
                  <CardHeading>{content[2].title}</CardHeading>
                  <Description>{content[2].description}</Description>
                </Box>
              </Box>
            </Card>
            <Card width="medium" gap="large" category={content[3].category}>
              <Image src={content[3].image} />
              <Box justify="center" align="center">
                <CardHeading>{content[3].title}</CardHeading>
                <Description>{content[3].description}</Description>
              </Box>
            </Card>
            <Card width="large" gap="large" category={content[4].category}>
              <Image src={content[4].image} />
              <Box align="center">
                <CardHeading>{content[4].title}</CardHeading>
                <Description>{content[4].description}</Description>
              </Box>
            </Card>
            <Card
              width="medium"
              align="start"
              gap="medium"
              category={content[5].category}
            >
              <Box>
                <Text size="medium" color="dark-3">
                  May 23, 2019
                </Text>
                <CardHeading>{content[5].title}</CardHeading>
                <Description>{content[5].description}</Description>
              </Box>
              <Image src={content[5].image} />
            </Card>
            <Card width="medium" gap="large" category={content[6].category}>
              <Box align="center">
                <CardHeading>{content[6].title}</CardHeading>
                <Description>{content[6].description}</Description>
              </Box>
              <Image src={content[6].image} />
            </Card>
            <Card
              width="medium"
              align="start"
              gap="medium"
              category={content[7].category}
            >
              <Image src={content[7].image} />
              <Box>
                <CardHeading>{content[7].title}</CardHeading>
                <Description>{content[7].description}</Description>
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
