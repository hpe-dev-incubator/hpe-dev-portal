import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Box, Heading, Button } from 'grommet';
import {
  Layout,
  SEO,
  PageDescription,
  Card,
  EventCard,
  ResponsiveGrid,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Events({ data }) {
  const pastEvents = data.pastEvents.edges;
  const upcomingEvents = data.upcomingEvents.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Events" />
      <Box flex overflow="auto" pad="xlarge" wrap>
        <PageDescription image="/img/events/EventsPage.svg" title="Events">
          <Link to="/newsletter-signup">
            <Button color="blue" primary label="Keep Me Posted" />
          </Link>
        </PageDescription>
        <Box pad="small" margin={{ top: 'large' }}>
          <Heading level="2" margin="none">
            Upcoming Events
          </Heading>
        </Box>
        <Box
          border={{
            side: 'top',
            color: 'blue',
            size: 'small',
          }}
        >
          {upcomingEvents.map(({ node }) => (
            <Card
              key={node.id}
              category={node.frontmatter.category}
              width={node.frontmatter.width}
              content={node.rawMarkdownBody}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
            />
          ))}
        </Box>
        <Box pad="small" margin={{ top: 'large' }}>
          <Heading level="2" margin="none">
            Past Events
          </Heading>
        </Box>
        <Box
          border={{
            side: 'top',
            color: 'blue',
            size: 'small',
          }}
          pad={{ top: 'small' }}
        >
          <ResponsiveGrid gap="large" rows={rows} columns={columns}>
            {pastEvents.map(({ node }) => (
              <EventCard
                key={node.id}
                category={node.frontmatter.category}
                title={node.frontmatter.title}
                timeframe={node.frontmatter.timeframe}
                width={node.frontmatter.width}
                content={node.rawMarkdownBody}
                link={node.frontmatter.link}
                image={node.frontmatter.image}
              />
            ))}
          </ResponsiveGrid>
        </Box>
      </Box>
    </Layout>
  );
}

Events.propTypes = {
  data: PropTypes.shape({
    upcomingEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              timeframe: PropTypes.string.isRequired,
              link: PropTypes.string.isRequired,
              image: PropTypes.string,
              category: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    pastEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              timeframe: PropTypes.string.isRequired,
              link: PropTypes.string.isRequired,
              image: PropTypes.string,
              category: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Events;

export const pageQuery = graphql`
  query {
    pastEvents: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "event" } }
        isFuture: { eq: false }
      }
      sort: { fields: [frontmatter___date], order: DESC }
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
            timeframe
            image
            category
            dateEnd
            link
            width
          }
        }
      }
    }
    upcomingEvents: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "event" } }
        isFuture: { eq: true }
      }
      sort: { fields: [frontmatter___date], order: DESC }
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
            timeframe
            image
            category
            dateEnd
            link
            width
          }
        }
      }
    }
  }
`;
