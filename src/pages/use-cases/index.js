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
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function UseCase({ data, location }) {
  const useCases = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  useEffect(() => {
    if (location.state && location.state.isPlatformHeaderClicked) {
      navigate('/use-cases', { replace: true });
      localStorage.removeItem('useCasesPosition');
    }
  }, [location]);

  useEffect(() => {
    const scrollPosition = JSON.parse(localStorage.getItem('useCasesPosition'));

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, left: 0, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <Layout title={siteTitle}>
      <SEO title="Explore Use Cases" />
      <PageDescription
        image="/img/use-cases/use-cases.png"
        title="Explore Use Cases"
        alt="Explore Use Cases logo"
      >
        <Paragraph size="large">
          Advances in technology offer opportunities to expand and grow. Learn
          how to harness the power of today’s innovation by exploring how it can
          be put to use.
        </Paragraph>
      </PageDescription>
      <SectionHeader>
        <ResponsiveGrid rows={rows} columns={columns}>
          {useCases.map(({ node }) => (
            <PlatformCard
              key={node.id}
              title={node.frontmatter.title}
              description={node.frontmatter.description}
              link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
              image={node.frontmatter.image}
              category={node.frontmatter.category}
            />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
    </Layout>
  );
}

UseCase.propTypes = {
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

export default UseCase;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {fields: {sourceInstanceName: {eq: "use-cases"}, slug: {regex: "//home/$/"}}, frontmatter: {isAside: {ne: true}}}
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
          }
        }
      }
    }
  }
`;
