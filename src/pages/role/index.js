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

function Role({ data, location }) {
  const roles = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  useEffect(() => {
    if (location.state && location.state.isPlatformHeaderClicked) {
      navigate('/roles', { replace: true });
      localStorage.removeItem('rolePosition');
    }
  }, [location]);

  useEffect(() => {
    const scrollPosition = JSON.parse(localStorage.getItem('rolePosition'));

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, left: 0, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <Layout title={siteTitle}>
      <SEO title="What's Your Role" />
      <PageDescription
        image="/img/role/roles-main-teal.png"
        title="What's Your Role?"
        alt="What's Your Role page logo"
      >
        <Paragraph size="large">
          Software is at the heart of everything we do. No matter your role,
          you’ll find resources and tools to assist you in building the best
          possible experience for your customers – from edge to cloud. Click on
          the cards below to learn more.
        </Paragraph>
      </PageDescription>
      <SectionHeader>
        <ResponsiveGrid rows={rows} columns={columns}>
          {roles.map(({ node }) => (
            <PlatformCard
              key={node.id}
              title={node.frontmatter.title}
              description={node.frontmatter.description}
              link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
              image={node.frontmatter.image}
              category={node.frontmatter.category}
              flex
            />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
    </Layout>
  );
}

Role.propTypes = {
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
              active: PropTypes.bool,
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

export default Role;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        fields: {
          sourceInstanceName: { eq: "role" }
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
            active
            priority
          }
        }
      }
    }
  }
`;
