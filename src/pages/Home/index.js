import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Button, Heading, Image, Text } from 'grommet';

import { Layout, SEO, Card, TitleMarkdown, ButtonLink } from '../../components';
import DeveloperStoriesSection from '../../components/DeveloperStoriesSection';
import WorkshopsOnDemandSection from '../../components/WorkshopsOnDemandSection';
import OpenSourceSection from '../../components/OpenSourceSection';
import HeroBannerSection from '../../components/HeroBannerSection';
import FeaturedTopicsSection from '../../components/FeaturedTopicsSection';
import WhatsNewSection from '../../components/WhatsNewSection';
import ComingEventsSection from '../../components/ComingEventsSection';
import CommunityCardsSection from '../../components/CommunityCardsSection';

const Home = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title;
  const title = data.markdownRemark?.frontmatter?.title || siteTitle;

  const panels = data.home.edges;
  const projects = data.opensource.edges;
  const latestPlatforms = data.latestPlatforms.edges;
  const events = data.events.edges;
  const latestBlogs = data.latestBlogs.edges;
  const featuredCards = data.featuredCards ? data.featuredCards.edges : [];

  return (
    <Layout title={siteTitle} fullWidth>
      <SEO title={title} />
      <HeroBannerSection />
      <Box width="100%" style={{ maxWidth: '1920px', margin: '0 auto' }}>
        <FeaturedTopicsSection cards={featuredCards} />
        <WhatsNewSection platforms={latestPlatforms} />
        <ComingEventsSection events={events} />{' '}
        {/* <Box direction="row-responsive" pad="xlarge" gap="xlarge" align="center">
        <Box>
          <TitleMarkdown>{data.markdownRemark.rawMarkdownBody}</TitleMarkdown>
          <Button
            label="Join the Community"
            primary
            reverse
            icon={<Image src="/img/home/hpe-element.png" />}
            href="/community"
            style={{
              backgroundColor: '#01A982',
              borderRadius: '100px',
              color: '#ffffff',
              width: 300,
            }}
          />
        </Box>
        <Box align="center">
          {image && <Image src={image} alt="hpedev logo" />}
        </Box>
      </Box> */}
        {/* <Box flex={false} direction="row-responsive" wrap margin="medium">
        {panels &&
          panels.map(({ node }) => (
            <Card
              key={node.id}
              category={node.frontmatter.category}
              width={node.frontmatter.width}
              content={node.rawMarkdownBody}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
              imageScale={node.frontmatter.imageScale}
              reverse={node.frontmatter.reverse}
              title={node.frontmatter.title}
              author={node.frontmatter.author}
            />
          ))}
      </Box> */}
        <DeveloperStoriesSection blogs={latestBlogs} />
        <WorkshopsOnDemandSection />
        <OpenSourceSection projects={projects} />
        <CommunityCardsSection />
      </Box>
    </Layout>
  );
};

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
              category: PropTypes.string,
              image: PropTypes.string,
              imageScale: PropTypes.number,
              link: PropTypes.string,
              priority: PropTypes.number,
              reverse: PropTypes.bool,
              active: PropTypes.bool,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
    }),
    latestPlatforms: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    events: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    latestBlogs: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({})),
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
              image: PropTypes.string,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
    }),
    featuredCards: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              eyebrow: PropTypes.string,
              title: PropTypes.string,
              description: PropTypes.string,
              cta: PropTypes.string,
              href: PropTypes.string,
              icon: PropTypes.string,
              bgImage: PropTypes.string,
              bgColor: PropTypes.string,
              overlay: PropTypes.string,
              isDark: PropTypes.bool,
              priority: PropTypes.number,
              active: PropTypes.bool,
            }),
          }),
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
    markdownRemark(fields: { sourceInstanceName: { eq: "home" } }) {
      excerpt
      frontmatter {
        title
        image
      }
      rawMarkdownBody
    }
    home: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "homepanels" } }
        frontmatter: { active: { eq: true } }
      }
      sort: { frontmatter: { priority: ASC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            width
            category
            link
            image
            imageScale
            title
            author
            reverse
            active
          }
          rawMarkdownBody
        }
      }
    }
    latestPlatforms: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "platform" } }
        frontmatter: { active: { eq: true } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 2
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            image
            date
          }
        }
      }
    }
    events: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "event" } } }
      sort: { frontmatter: { dateStart: DESC } }
      limit: 12
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          frontmatter {
            title
            dateStart
            dateEnd
            category
            image
            link
          }
        }
      }
    }
    latestBlogs: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { disable: { ne: true } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 6
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          frontmatter {
            title
            date
            author
            authorimage
            thumbnailimage
          }
        }
      }
    }
    opensource: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "opensource" } }
        frontmatter: { Featured: { eq: true } }
      }
      sort: { frontmatter: { priority: ASC } }
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
            github
            frontpage
            priority
            link
          }
        }
      }
    }
    featuredCards: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "featuredcards" } }
        frontmatter: { active: { eq: true } }
      }
      sort: { frontmatter: { priority: ASC } }
      limit: 4
    ) {
      edges {
        node {
          id
          frontmatter {
            eyebrow
            title
            description
            cta
            href
            icon
            bgImage
            bgColor
            overlay
            isDark
            priority
            active
          }
        }
      }
    }
  }
`;
