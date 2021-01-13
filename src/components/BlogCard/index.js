import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import strip from 'strip-markdown';
import {
  Box,
  Heading,
  Text,
  Image,
  Card as GrommetCard,
  CardHeader,
  Paragraph,
} from 'grommet';
import { navigate } from 'gatsby';

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

export const BlogCard = ({ node, ...rest }) => (
  <GrommetCard
    pad="large"
    direction="row"
    justify="between"
    {...rest}
    elevation="medium"
    wrap
    onClick={
      node.path || node.frontmatter.path
        ? () => navigate(node.path || node.frontmatter.path)
        : undefined
    }
  >
    <Box gap="small">
      <Box align="start">
        <Image src="/img/blogs/Avatar1.svg" />
      </Box>
      <Box align="start">
        <Text>{node.author || node.frontmatter.author}</Text>
      </Box>
      <Heading level={4} margin="none">
        {node.title || node.frontmatter.title}
      </Heading>
      {(node.date || node.frontmatter.date) && (
        <Text color="text-weak">
          {`${dateFormat.format(new Date(node.date || node.frontmatter.date))}`}
        </Text>
      )}
    </Box>
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
        <Heading level={4} margin="none">
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
          <Text color="text-weak">
            {dateFormat.format(new Date(node.frontmatter.date))}
          </Text>
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
