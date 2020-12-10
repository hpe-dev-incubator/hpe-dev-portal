import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Image } from 'grommet';

import { Layout, SEO, Card, PlatformCard } from '../../components';

class Home extends React.Component {
  render() {
    const { data } = this.props;
    console.log('data', data);
    const { title, image } = data.markdownRemark.frontmatter;
    const siteTitle = data.site.siteMetadata.title;

    const panels = data.home.edges;

    const projects = data.opensource.edges;

    return (
      <Layout title={siteTitle}>
        <SEO title={title} />
        <Box flex overflow="auto" gap="medium" pad="small">
          <Box flex={false} direction="row-responsive" wrap>
            <Card
              direction="row-responsive"
              width="large"
              gap="large"
              category=""
              content={data.markdownRemark.rawMarkdownBody}
            >
              <Box align="center">{image && <Image src={image} />}</Box>
            </Card>
            {panels &&
              panels.map(({ node }) => (
                <Card
                  key={node.id}
                  category={node.frontmatter.category}
                  width={node.frontmatter.width}
                  align={node.frontmatter.align}
                  content={node.rawMarkdownBody}
                  link={node.frontmatter.link}
                />
              ))}
          </Box>
          <Box direction="column">
            <Heading>Our Open Source Projects</Heading>
            <Box direction="row" wrap overflow="hidden">
              {projects &&
                projects.map(({ node }) => (
                  <PlatformCard
                    key={node.id}
                    title={node.frontmatter.title}
                    category={node.frontmatter.category}
                    width="small"
                    align="start"
                    content={node.frontmatter.description}
                    image={node.frontmatter.image}
                  />
                ))}
            </Box>
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
        image: PropTypes.string,
      }).isRequired,
      rawMarkdownBody: PropTypes.string,
    }).isRequired,
    home: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              width: PropTypes.string,
              align: PropTypes.string,
              category: PropTypes.string,
              priority: PropTypes.number,
              link: PropTypes.string,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
    }),
    opensource: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string,
              category: PropTypes.string,
              description: PropTypes.string,
              image: PropTypes.number,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
    }),
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
        image
      }
      rawMarkdownBody
    }
    home: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "homepanels" } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          frontmatter {
            width
            align
            category
            link
          }
          rawMarkdownBody
        }
      }
    }
    opensource: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "opensource" } } }
      sort: { fields: [frontmatter___title] }
      limit: 5
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            category
            description
            image
            frontpage
            priority
          }
        }
      }
    }
  }
`;
