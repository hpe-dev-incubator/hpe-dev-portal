import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import {
  Box,
  Card as GrommetCard,
  CardHeader,
  Heading,
  Image,
  Paragraph,
  Text,
} from 'grommet';
import { LinkNext } from 'grommet-icons';

import {
  Layout,
  SEO,
  Card,
  TitleMarkdown,
  ExternalButtonLink,
} from '../../components';

const OpenSourceCard = ({ children }) => (
  <Box pad={{ horizontal: 'small' }}>
    <GrommetCard elevation="medium" fill="horizontal">
      <CardHeader pad={{ horizontal: 'large', vertical: 'medium' }}>
        <Heading level={2} margin="none">
          Featured Open Source Projects
        </Heading>
        <ExternalButtonLink
          icon={<LinkNext color="green" />}
          to="https://www.hpe.com/us/en/open-source.html"
        />
      </CardHeader>
      <Box
        direction="row"
        wrap
        gap="large"
        pad={{ horizontal: 'large', bottom: 'large' }}
        justify="between"
      >
        {children}
      </Box>
    </GrommetCard>
  </Box>
);

OpenSourceCard.propTypes = {
  children: PropTypes.node,
};

const Project = ({ image, title, description, link }) => (
  <Box
    width="200px"
    height="308px"
    /* eslint-disable */
    onClick={
      link && link.match(/^\//g)
        ? () => navigate(link)
        : link
        ? () => window.open(link)
        : undefined
    }
  >
    <Box fill="horizontal" height="96px" flex={false}>
      <Image height="96px" width="96px" src={image} />
    </Box>
    <Box fill="vertical" overflow="hidden">
      <Text size="large" weight="bold">
        {title}
      </Text>
      <Paragraph truncate margin="none" size="large">
        {description && description.length > 115
          ? description.substring(0, 115) + '...'
          : description}
      </Paragraph>
    </Box>
  </Box>
);

Project.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
};

const Home = ({ data }) => {
  const { title, image } = data.markdownRemark.frontmatter;
  const siteTitle = data.site.siteMetadata.title;

  const panels = data.home.edges;

  const projects = data.opensource.edges;

  return (
    <Layout title={siteTitle}>
      <SEO title={title} />
      <Box flex overflow="auto" gap="medium" pad="small">
        <Box
          direction="row-responsive"
          pad="xlarge"
          gap="xlarge"
          align="center"
        >
          <Box align="center">{image && <Image src={image} />}</Box>
          <TitleMarkdown>{data.markdownRemark.rawMarkdownBody}</TitleMarkdown>
        </Box>
        <Box flex={false} direction="row-responsive" wrap justify="stretch">
          {panels &&
            panels.map(({ node }) => (
              <Card
                key={node.id}
                category={node.frontmatter.category}
                width={node.frontmatter.width}
                content={node.rawMarkdownBody}
                link={node.frontmatter.link}
                image={node.frontmatter.image}
                reverse={node.frontmatter.reverse}
              />
            ))}
        </Box>
        <OpenSourceCard>
          {projects &&
            projects.map(({ node }) => (
              <Project
                key={node.id}
                image={node.frontmatter.image}
                title={node.frontmatter.title}
                description={node.frontmatter.description}
                link={node.frontmatter.link}
              />
            ))}
        </OpenSourceCard>
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
              link: PropTypes.string,
              priority: PropTypes.number,
            }),
          }),
          rawMarkdownBody: PropTypes.string,
        }),
      ),
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
    markdownRemark(fields: { slug: { eq: "/" } }) {
      excerpt
      frontmatter {
        title
        image
      }
      rawMarkdownBody
    }
    home: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "homepanels" } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          frontmatter {
            width
            category
            link
            image
          }
          rawMarkdownBody
        }
      }
    }
    opensource: allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "opensource" } }
        frontmatter: { Featured: { eq: true } }
      }
      sort: { fields: [frontmatter___priority] }
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
            frontpage
            priority
            link
          }
        }
      }
    }
  }
`;
