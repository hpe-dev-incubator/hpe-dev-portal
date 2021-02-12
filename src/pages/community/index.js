import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Box,
  Heading,
  Image,
  Button,
  Card,
  Paragraph,
  CardBody,
  Grid,
  CardFooter,
  Text,
} from 'grommet';

import { PageDescription, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

function Community({ data }) {
  const communities = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  return (
    <Layout title={siteTitle}>
      <SEO title="Community" />
      <Box flex overflow="auto" gap="large" pad="xlarge" wrap>
        <PageDescription image="/img/community/community.svg" title="Community">
          <Text>
            A community is all about connection. Discover the many different
            ways you can connect with members of the HPE DEV Community here.
          </Text>
        </PageDescription>
        <Box
          border={{
            side: 'top',
            color: 'yellow',
            size: 'small',
          }}
          fill="horizontal"
          margin={{ top: 'large' }}
          pad={{ top: 'small' }}
        >
          <Grid gap="medium" columns={{ count: 'fit', size: 'small' }}>
            {communities.map(({ node }) => (
              <Card elevation="medium" gap="medium" pad="large">
                <CardBody pad="none" align="start">
                  {node.frontmatter.image && (
                    <Image src={node.frontmatter.image} />
                  )}
                </CardBody>
                <Box responsive={false}>
                  <Heading margin="none" level="4">
                    {node.frontmatter.title}
                  </Heading>
                  <Paragraph margin="none">
                    {node.frontmatter.description}
                  </Paragraph>
                </Box>
                <CardFooter pad="none">
                  <Box wrap align="start">
                    <Button
                      color="yellow"
                      primary
                      label={node.frontmatter.linkname}
                      href={node.frontmatter.link}
                      target="_blank"
                    />
                  </Box>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

Community.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              link: PropTypes.string,
              linkname: PropTypes.string,
              priority: PropTypes.number,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Community;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "community" } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            link
            description
            image
            linkname
            priority
          }
        }
      }
    }
  }
`;
