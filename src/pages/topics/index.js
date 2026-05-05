import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Card, CardBody } from 'grommet';
import { Layout, SEO, ButtonLink } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function Topics({ data }) {
  const topics = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Topics" />
      <Box pad={{ horizontal: 'xlarge', vertical: 'large' }} gap="large">
        <Box gap="small">
          <Heading level={1} margin="none">
            Topics
          </Heading>
          <Text size="large" color="text-weak">
            Explore curated resources across the most important technology areas
            for HPE developers.
          </Text>
        </Box>
        <Box
          direction="row-responsive"
          wrap
          gap="medium"
        >
          {topics.map(({ node }) => {
            const { title, description } = node.frontmatter;
            const { slug } = node.fields;
            return (
              <Card
                key={slug}
                width={{ min: '280px', max: '360px' }}
                elevation="small"
                round="small"
                pad="medium"
                gap="small"
                background="white"
              >
                <CardBody gap="small">
                  <Heading level={3} margin="none">
                    {title}
                  </Heading>
                  {description && (
                    <Text size="small" color="text-weak">
                      {description.length > 150
                        ? `${description.substring(0, 147)}...`
                        : description}
                    </Text>
                  )}
                  <Box>
                    <ButtonLink
                      label={`Explore ${title} →`}
                      to={`/topic${slug}`}
                      alignSelf="start"
                    />
                  </Box>
                </CardBody>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Layout>
  );
}

Topics.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }).isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Topics;

export const pageQuery = graphql`
  query TopicsIndexQuery {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "topic" } }
        frontmatter: { active: { eq: true } }
      }
      sort: { frontmatter: { priority: ASC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            priority
          }
        }
      }
    }
  }
`;
