import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import styled from 'styled-components';
import {
  FeaturedEventsSection,
  HeroCtaButton,
  Layout,
  PastEventsSection,
  ReusableHeroSection,
  SEO,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const ListingSection = styled.section`
  background: #f7f7f7;
  padding: 64px max(24px, 8.33%, calc((100% - 1600px) / 2)) 96px;

  @media (max-width: 768px) {
    padding: 40px 24px 64px;
  }
`;

function Events({ data }) {
  const pastEvents = data.pastEvents.edges;
  const upcomingEvents = data.upcomingEvents.edges;
  const onGoingEvents = data.onGoingEvents.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  // Ongoing events are happening right now, so they take priority over
  // events that have not started yet; both queries already sort by
  // dateStart ascending, so concatenating keeps soonest-first order.
  const featuredEvents = [...onGoingEvents, ...upcomingEvents];

  return (
    <Layout title={siteTitle} fullWidth>
      <SEO title="Events" />
      <ReusableHeroSection
        image="/img/events/events-hero-bg.jpg"
        title="Events"
        alt="events page background"
        backgroundPosition="50% 33%"
        showRightMidGradient
        height="auto"
      >
        <Text size="large">
          Technology moves fast. Participating in events helps you stay ahead
          of the curve. Mark your calendar and connect with us at any of
          these upcoming events.
        </Text>
        <HeroCtaButton
          to="/newsletter-signup"
          state={{ state: { isNewsletterHeaderClicked: true } }}
          label={
            <Text
              size="20px"
              weight={500}
              color="#292d3a"
              style={{ lineHeight: '24px', whiteSpace: 'nowrap' }}
            >
              Keep Me Posted
            </Text>
          }
          icon={<LinkNext color="#292d3a" size="24px" />}
          reverse
          plain={false}
          round="full"
          pad={{ horizontal: '36px', vertical: '20px' }}
          gap="12px"
          alignSelf="start"
          margin={{ top: 'medium' }}
        />
      </ReusableHeroSection>
      {featuredEvents.length > 0 && (
        <FeaturedEventsSection events={featuredEvents} />
      )}
      <ListingSection>
        <PastEventsSection events={pastEvents} />
      </ListingSection>
    </Layout>
  );
}

const eventNodePropType = PropTypes.shape({
  frontmatter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    width: PropTypes.string,
  }).isRequired,
  excerpt: PropTypes.string,
  fields: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    sourceInstanceName: PropTypes.string.isRequired,
  }),
});

Events.propTypes = {
  data: PropTypes.shape({
    upcomingEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({ node: eventNodePropType }).isRequired,
      ).isRequired,
    }).isRequired,
    pastEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({ node: eventNodePropType }).isRequired,
      ).isRequired,
    }).isRequired,
    onGoingEvents: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({ node: eventNodePropType }).isRequired,
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
      sort: { frontmatter: { dateStart: DESC } }
    ) {
      edges {
        node {
          id
          fields {
            slug
            sourceInstanceName
          }
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
      sort: { frontmatter: { dateStart: ASC } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 220)
          fields {
            slug
            sourceInstanceName
          }
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
    onGoingEvents: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "event" } }
        isOngoing: { eq: true }
      }
      sort: { frontmatter: { dateStart: ASC } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 220)
          fields {
            slug
            sourceInstanceName
          }
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
