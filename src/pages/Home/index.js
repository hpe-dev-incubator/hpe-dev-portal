import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Image } from 'grommet';

import { Layout, SEO, Card } from '../../components';

class Home extends React.Component {
  render() {
    const { data } = this.props;
    const { title, image } = data.markdownRemark.frontmatter;
    const siteTitle = data.site.siteMetadata.title;

    const panels = data.allMarkdownRemark.edges;

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
    allMarkdownRemark: PropTypes.shape({
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
    allMarkdownRemark(
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
  }
`;
