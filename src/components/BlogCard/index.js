import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import remark from 'remark';
import strip from 'strip-markdown';
import {
  Box,
  Heading,
  Text,
  Image,
  Grid,
  ResponsiveContext,
  Card as GrommetCard,
  CardHeader,
  Paragraph,
} from 'grommet';
import { Link as GatsbyLink, navigate } from 'gatsby';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

const dateFormat = Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const stripMarkdown = (markdown) => {
  let text = markdown;
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      text = file.contents;
    });
  return text;
};

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

export const AllBlogsCard = ({
  children,
  overrideColumns,
  overrideRows,
  areas,
  ...props
}) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      // Take into consideration if not array is sent but a simple string
      let columnsVal = columns;
      if (columns) {
        if (columns[size]) {
          columnsVal = columns[size];
        }
      }

      let rowsVal = rows;
      if (rows) {
        if (rows[size]) {
          rowsVal = rows[size];
        }
      }

      // Also if areas is a simple array not an object of arrays for
      // different sizes
      let areasVal = areas;
      if (areas && !Array.isArray(areas)) areasVal = areas[size];

      return (
        <Grid
          {...props}
          areas={!areasVal ? undefined : areasVal}
          rows={!rowsVal ? size : rowsVal}
          columns={!columnsVal ? size : columnsVal}
        >
          {children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);

AllBlogsCard.propTypes = {
  overrideColumns: PropTypes.string,
  children: PropTypes.node,
  overrideRows: PropTypes.string,
  areas: PropTypes.string,
};

export const BlogCard = ({ node, ...rest }) => (
  <GrommetCard
    pad="large"
    direction="row"
    justify="between"
    {...rest}
    elevation="medium"
    wrap
  >
    <NavLink to={`${node.path || node.frontmatter.path}`}>
      <Box gap="small">
        <Box align="start">
          <Image src="/img/blogs/Avatar1.svg" />
        </Box>
        <Box align="start">
          <Text color="text">{node.author || node.frontmatter.author}</Text>
        </Box>
        <Heading level={4} margin="none" color="text">
          {node.title || node.frontmatter.title}
        </Heading>
        {(node.date || node.frontmatter.date) && (
          <Text color="border">
            {`${dateFormat.format(
              new Date(node.date || node.frontmatter.date),
            )}`}
          </Text>
        )}
      </Box>
    </NavLink>
  </GrommetCard>
);

BlogCard.propTypes = {
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      date: PropTypes.string,
      path: PropTypes.string,
    }),
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    path: PropTypes.string,
    excerpt: PropTypes.string,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      sourceInstanceName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export const FeaturedBlogCard = ({ node, ...rest }) => (
  <GrommetCard
    elevation="medium"
    flex="grow"
    {...rest}
    onClick={
      node.frontmatter.path ? () => navigate(node.frontmatter.path) : undefined
    }
  >
    <CardHeader justify="end" pad={{ vertical: 'small', horizontal: 'medium' }}>
      <Text color="text-weak">{node.frontmatter.tags}</Text>
    </CardHeader>
    <Box align="start" pad="large" gap="medium">
      <Box gap="small">
        <Heading level={4} margin="none" color="text">
          {node.frontmatter.title}
        </Heading>
        <Paragraph margin="none">
          {node.frontmatter.description || stripMarkdown(node.excerpt)}
        </Paragraph>
      </Box>
      <Box align="start" direction="row" gap="small">
        <Image fit="contain" src="/img/blogs/Avatar1.svg" />
        <Box align="start" alignSelf="center">
          <Text weight="bold">{node.frontmatter.author}</Text>
          <Text>{dateFormat.format(new Date(node.frontmatter.date))}</Text>
        </Box>
      </Box>
    </Box>
  </GrommetCard>
);

FeaturedBlogCard.propTypes = BlogCard.propTypes;

export const SectionHeader = ({ color, title, children }) => {
  return (
    <>
      <Box pad="small" margin={{ top: 'large' }}>
        <Heading margin="none" level="2">
          {title}
        </Heading>
      </Box>
      <Box
        gap="large"
        border={{
          side: 'top',
          color,
          size: 'small',
        }}
        pad={{ top: 'small' }}
      >
        {children}
      </Box>
    </>
  );
};

SectionHeader.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
