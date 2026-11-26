import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import {
  DeveloperDaysPastEvents,
  HeroCtaButton,
  Layout,
  ReusableHeroSection,
  SEO,
  UpcomingWorkshopsSection,
  WorkshopOverviewSection,
} from '../../../components';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';

// "HPE AI Developer Days" is a recurring global workshop series run with
// NVIDIA. Each past city stop is a regular content/event markdown entry
// (category "HPE AI Developer Day"), editable via the CMS the same way as
// any other event; this page queries those entries directly rather than
// linking out to the series' external Bizzabo registration site. Entries
// are matched to this series by their external registration link still
// pointing at Bizzabo, which is how the handful of other
// "HPE AI Developer Day" entries not part of this specific city tour
// (e.g. a Stockholm meetup run through a different registration site) are
// excluded.
const UPCOMING_WORKSHOPS = [
  {
    city: 'Santiago de Chile',
    description:
      'A small-group, one-day workshop guided by HPE and NVIDIA advisors.',
    image: '/img/events/developer-days/santiago-de-chile.png',
  },
  {
    city: 'Paris, France',
    description:
      'A small-group, one-day workshop guided by HPE and NVIDIA advisors.',
    image: '/img/events/developer-days/paris-france.png',
  },
];

function AiDeveloperDays({ data }) {
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const pastEvents = data.pastDeveloperDays.edges;

  return (
    <Layout title={siteTitle} fullWidth>
      <SEO
        title="HPE AI Developer Days 2026"
        description="Build and deploy real AI solutions with guidance from HPE and NVIDIA advisors at an HPE AI Developer Day near you."
      />
      <ReusableHeroSection
        image="/img/events/events-hero-bg.jpg"
        title="HPE AI Developer Days 2026"
        alt="HPE AI Developer Days background"
        backgroundPosition="50% 33%"
        showRightMidGradient
        height="auto"
        logos={[
          {
            src: '/img/events/developer-days/hpe-logo-light.svg',
            alt: 'HPE',
            height: '30px',
          },
          {
            src: '/img/events/developer-days/nvidia-logo.svg',
            alt: 'NVIDIA',
            height: '28px',
          },
        ]}
      >
        <Text size="large">
          Build and deploy real AI solutions with guidance from HPE and
          NVIDIA advisors — and leave with the tools, skills, and confidence
          to do it again.
        </Text>
        <HeroCtaButton
          to="/community"
          label={
            <Text
              size="20px"
              weight={500}
              color="#292d3a"
              style={{ lineHeight: '24px', whiteSpace: 'nowrap' }}
            >
              Join the Community
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
      <WorkshopOverviewSection
        eyebrow="WORKSHOP OVERVIEW"
        title="From AI ambition to real-world results"
        paragraphs={[
          'HPE Developer Day is a focused one-day event designed to help you move from AI ambition to real-world results. In a small-group setting, you’ll go hands-on with tools like HPE Private Cloud AI, NVIDIA blueprints, ProHawk, Vaidio, and AiBle. You’ll learn how to use them to build a working, cross-industry AI solution.',
          'Join us for this practical, dev-focused experience and move your AI ambitions forward.',
        ]}
        takeawaysTitle="What you’ll take away"
        takeawaysIntro="Whether you’re a developer or technical decision-maker, you’ll leave with:"
        takeaways={[
          'A working blueprint for building and deploying AI use cases',
          'Experience across the full AI stack',
          'Answers to your most pressing questions in discussion and Q&A sessions',
          'Guidance from HPE and NVIDIA advisors',
        ]}
      />
      <UpcomingWorkshopsSection
        title="Upcoming workshops"
        subtitle="Meet us in Santiago and Paris for a hands-on day with AI builders."
        workshops={UPCOMING_WORKSHOPS}
      />
      <DeveloperDaysPastEvents
        title="Past events"
        subtitle="Explore HPE AI Developer Days from around the world."
        events={pastEvents}
      />
    </Layout>
  );
}

AiDeveloperDays.propTypes = {
  data: PropTypes.shape({
    pastDeveloperDays: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }).isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              image: PropTypes.string,
            }).isRequired,
          }).isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default AiDeveloperDays;

export const pageQuery = graphql`
  query {
    pastDeveloperDays: allMarkdownRemark(
      filter: {
        fields: {
          sourceInstanceName: { eq: "event" }
          slug: { ne: "/hpe-ai-developer-day-paris-france/" }
        }
        frontmatter: {
          category: { eq: "HPE AI Developer Day" }
          link: { regex: "/bizzabo/" }
        }
      }
      sort: { frontmatter: { dateStart: DESC } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            image
          }
        }
      }
    }
  }
`;
