import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { Heading, Paragraph } from 'grommet';

import {
  PlatformCard,
  Layout,
  SEO,
  PageDescription,
  ResponsiveGrid,
  SectionHeader,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Platform({ data, location }) {
  const platforms = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  useEffect(() => {
    if (location.state && location.state.isPlatformHeaderClicked) {
      navigate('/platforms', { replace: true });
      localStorage.removeItem('platformPosition');
    }
  }, [location]);

  useEffect(() => {
    const scrollPosition = JSON.parse(localStorage.getItem('platformPosition'));

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, left: 0, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <Layout title={siteTitle}>
      <SEO title="Our Technologies" />
      <PageDescription
        image="/img/platforms/PlatformsPage.svg"
        title="Our Technologies"
        alt="technology page logo"
      >
        <Paragraph size="large">
          Supporting developers, data scientists, and architects is what we do.
          Find APIs, GitHub repositories and many of the other resources you
          need here.
        </Paragraph>
      </PageDescription>
      <SectionHeader>
        <ResponsiveGrid rows={rows} columns={columns}>
          {platforms.map(({ node }) => (
            <PlatformCard
              key={node.id}
              title={node.frontmatter.title}
              description={node.frontmatter.description}
              link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
              // image={node.frontmatter.image}
              category={node.frontmatter.category}
              flex
            />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
    </Layout>
  );
}

Platform.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              version: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              frontpage: PropTypes.bool,
              priority: PropTypes.number,
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
  location: PropTypes.shape({
    state: PropTypes.shape({
      isPlatformHeaderClicked: PropTypes.bool,
    }),
  }),
};

export default Platform;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: {
          sourceInstanceName: { eq: "platform" }
          slug: { regex: "//home/$/" }
        }
        frontmatter: { isAside: { ne: true }, active: { eq: true } }
      }
      sort: {frontmatter: {priority: ASC}}
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
            version
            description
            image
            frontpage
            priority
            active
          }
        }
      }
    }
  }
`;
