import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import {
  Box,
  Button,
  Card as GrommetCard,
  CardHeader,
  Grid,
  Heading,
  Image,
  Paragraph,
  Text,
} from 'grommet';
import { LinkNext } from 'grommet-icons';

import { Layout, SEO, Card, TitleMarkdown, ButtonLink } from '../../components';

const OpenSourceCard = ({ children }) => (
  <Box pad={{ horizontal: 'large', bottom: 'large' }}>
    <GrommetCard elevation="medium" fill="horizontal">
      <CardHeader pad={{ horizontal: 'large', vertical: 'medium' }}>
        <Heading level={2} margin="none">
          Featured Open Source Projects
        </Heading>
        <ButtonLink icon={<LinkNext color="green" />} to="/opensource" />
      </CardHeader>
      <Grid
        columns="small"
        gap="large"
        pad={{ horizontal: 'large', bottom: 'large' }}
      >
        {children}
      </Grid>
    </GrommetCard>
  </Box>
);

OpenSourceCard.propTypes = {
  children: PropTypes.node,
};

const Project = ({ title, description, link }) => (
  <Box
    align="start"
    gap="medium"
    /* eslint-disable */
    onClick={
      link && link.match(/^\//g)
        ? () => navigate(link)
        : link
        ? () => window.open(link)
        : undefined
    }
  >
    {/* <Box flex={false} height="xsmall" width="xsmall">
      <Image src={image} fit="contain" alt="opensource project logo" />
    </Box> */}
    <Box>
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
      <Box direction="row-responsive" pad="xlarge" gap="xlarge" align="center">
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
      </Box>
      <Box flex={false} direction="row-responsive" wrap margin="medium">
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
      filter: {
        fields: { sourceInstanceName: { eq: "homepanels" } }
        frontmatter: { active: { eq: true } }
      }
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
