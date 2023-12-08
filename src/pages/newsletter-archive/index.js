import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Tab, Tabs, Heading, Paragraph } from 'grommet';
import {
  Layout,
  SEO,
  PageDescription,
  NewsletterCard,
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
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function NewsletterArchive({ data }) {
  const newsletters = data.allMarkdownRemark.group.sort((a, b) =>
    a.fieldValue < b.fieldValue ? 1 : -1,
  );
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Newsletter-Archive" />
      <PageDescription
        image="/img/newsletter/NewsletterPage.svg"
        title="Newsletter Archive"
        alt="newsletter page logo"
      >
        <Paragraph>
          Each month we alert subscribers to what's new in the HPE Developer
          Community through our newsletter. Find what you may have missed in any
          of our previous editions by visiting our archive.
        </Paragraph>
      </PageDescription>
      <Box margin={{ top: 'large' }}>
        <Heading margin="none" level="2">
          Newsletter Archive
        </Heading>
        <Tabs activeIndex={index} onActive={onActive} justify="start">
          {newsletters.map((newsletter, i) => (
            <Tab key={i} title={newsletter.fieldValue}>
              <ResponsiveGrid rows={rows} columns={columns}>
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

NewsletterArchive.propTypes = {
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
};

export default NewsletterArchive;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "newsletter" } } }
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
