import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Box, Button, Paragraph } from 'grommet';
import {
  Layout,
  SEO,
  PageDescription,
  Card,
  EventCard,
  ResponsiveGrid,
  SectionHeader,
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
  const onGoingEvents = data.onGoingEvents.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Events" />
      <PageDescription
        image="/img/events/EventsPage.svg"
        title="Events"
        alt="events page logo"
      >
        <Box gap="small">
          <Box>
            <Paragraph>
              Technology moves fast. Participating in events helps you stay
              ahead of the curve. Mark your calendar and connect with us at any
              of these upcoming events.
            </Paragraph>
          </Box>
          <Box>
            <Link to="/newsletter-signup">
              <Button primary label="Keep Me Posted" />
            </Link>
          </Box>
        </Box>
      </PageDescription>
      {onGoingEvents && onGoingEvents.length > 0 && (
        <SectionHeader title="Ongoing Events">
          {onGoingEvents.map(({ node }) => (
            <Card
              key={node.id}
              category={node.frontmatter.category}
              width={node.frontmatter.width}
              content={node.rawMarkdownBody}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
            />
          ))}
        </SectionHeader>
      )}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <SectionHeader title="Upcoming Events">
          {upcomingEvents.map(({ node }) =>  (
            <Card
              key={node.id}
              category={node.frontmatter.category}
              width={node.frontmatter.width}
              content={node.rawMarkdownBody}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
              source={node.fields.sourceInstanceName}
            />
          ))}
        </SectionHeader>
      )}
      {pastEvents && pastEvents.length > 0 && (
        <SectionHeader title="Past Events">
          <ResponsiveGrid rows={rows} columns={columns}>
            {pastEvents.map(({ node }) => (
              <EventCard key={node.id} node={node} />
            ))}
          </ResponsiveGrid>
        </SectionHeader>
      )}
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
    onGoingEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
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
        isPast: { eq: true }
      }
      sort: { fields: [frontmatter___dateStart], order: DESC }
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
            image
            category
            dateStart
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
        isUpcoming: { eq: true }
      }
      sort: { fields: [frontmatter___dateStart], order: ASC }
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
            image
            category
            dateEnd
            link
            width
          }
        }
      }
    }
    onGoingEvents: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "event" } }
        isOngoing: { eq: true }
      }
      sort: { fields: [frontmatter___dateStart], order: ASC }
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
            image
            category
            dateStart
            dateEnd
            link
            width
          }
        }
      }
    }
  }
`;
