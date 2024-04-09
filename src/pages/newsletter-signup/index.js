import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Box, Tab, Tabs, Heading } from 'grommet';
import {
  Layout,
  SEO,
  PageDescription,
  NewsletterCard,
  ResponsiveGrid,
} from '../../components';
import { EmailCapture } from '../../containers';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};
function NewsletterSignup({ data, location }) {
  const newsletters = data.allMarkdownRemark.group.sort((a, b) =>
    a.fieldValue < b.fieldValue ? 1 : -1,
  );
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  useEffect(() => {
    if (location.state && location.state.isNewsletterHeaderClicked) {
      navigate('/newsletter-signup', { replace: true });
      localStorage.removeItem('newsletterData');
    }
  }, [location]);

  useEffect(() => {
    const newsletterLocalStorage = JSON.parse(
      localStorage.getItem('newsletterData'),
    );

    if (newsletterLocalStorage && newsletterLocalStorage.index) {
      setIndex(newsletterLocalStorage.index);
    }
    if (newsletterLocalStorage && newsletterLocalStorage.position) {
      setTimeout(() => {
        window.scrollTo({
          top: newsletterLocalStorage.position,
          left: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, []);

  return (
    <Layout title={siteTitle}>
      <SEO title="Newsletter-Signup" />
      <PageDescription
        image="/img/newsletter/NewsletterPage.svg"
        title=""
        alt="newsletter logo"
      >
        <EmailCapture
          heading="Newsletter"
          bodyCopy1="Subscribe to our HPE Developer Newsletter 
          to stay up-to-date on the 
          newest HPE Dev Community activities, posts, and tutorials."
        />
      </PageDescription>
      <Box margin="large" gap="medium">
        <Heading level="2" margin="none">
          Newsletter Archive
        </Heading>
        <Tabs activeIndex={index} onActive={onActive} justify="start">
          {newsletters.map((newsletter, i) => (
            <Tab key={i} title={newsletter.fieldValue}>
              <ResponsiveGrid
                rows={rows}
                columns={columns}
                margin={{ top: 'large' }}
              >
                {newsletter.edges.map(({ node }) => (
                  <NewsletterCard
                    key={node.id}
                    title={node.frontmatter.title}
                    description={node.frontmatter.description}
                    link={node.frontmatter.link}
                    stars={false}
                    date={node.frontmatter.date}
                    monthly={node.frontmatter.monthly}
                    newsletter
                    index={index}
                  />
                ))}
              </ResponsiveGrid>
            </Tab>
          ))}
        </Tabs>
      </Box>
    </Layout>
  );
}

NewsletterSignup.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string,
          totalcount: PropTypes.number,
          edges: PropTypes.arrayOf(
            PropTypes.shape({
              node: PropTypes.shape({
                frontmatter: PropTypes.shape({
                  title: PropTypes.string.isRequired,
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
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      isNewsletterHeaderClicked: PropTypes.bool,
    }),
  }),
};

export default NewsletterSignup;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {fields: {sourceInstanceName: {eq: "newsletter"}}}
      sort: {frontmatter: {date: ASC}}
    ) {
      group(field: {fields: {year: SELECT}}) {
        fieldValue
        totalCount
        edges {
          node {
            id
            rawMarkdownBody
            fields {
              slug
              sourceInstanceName
              year
            }
            excerpt
            frontmatter {
              title
              date
              description
              link
              monthly
            }
          }
        }
      }
    }
  }
`;
