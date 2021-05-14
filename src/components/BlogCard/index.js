import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import strip from 'strip-markdown';
import { navigate } from 'gatsby';
import {
  Box,
  Heading,
  Text,
  Image,
  Card as GrommetCard,
  CardHeader,
  Paragraph,
} from 'grommet';

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
      node.fields.slug && node.fields.sourceInstanceName
        ? (e) => {
            navigate(`/${node.fields.sourceInstanceName}${node.fields.slug}`);
            localStorage.setItem(
              'blogPosition',
              JSON.stringify(e.nativeEvent.pageY - e.nativeEvent.clientY),
            );
          }
        : undefined
    }
  >
    <Box gap="small">
      <Box align="start">
        {(node.authorimage || node.frontmatter.authorimage) && (
          <Image
            width="96px"
            height="96px"
            src={node.authorimage || node.frontmatter.authorimage}
            alt="author logo"
          />
        )}
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
    {...rest}
    onClick={
      node.fields.slug && node.fields.sourceInstanceName
        ? () =>
            navigate(`/${node.fields.sourceInstanceName}${node.fields.slug}`)
        : undefined
    }
  >
    {(node.frontmatter.category || node.frontmatter.tags) && (
      <CardHeader
        justify="end"
        pad={{ vertical: 'small', horizontal: 'medium' }}
      >
        <Text color="text-weak">
          {node.frontmatter.category
            ? node.frontmatter.category
            : node.frontmatter.tags[0]}
        </Text>
      </CardHeader>
    )}
    <Box direction="row-responsive" justify="between">
      <Box
        align="start"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        gap="medium"
      >
        <Box align="start" direction="row" gap="small">
          <Image
            width="96px"
            height="96px"
            src={node.frontmatter.authorimage}
            alt="author logo"
          />
          <Box align="start" alignSelf="center">
            <Text weight="bold">{node.frontmatter.author}</Text>
            <Text color="text-weak">
              {dateFormat.format(new Date(node.frontmatter.date))}
            </Text>
          </Box>
        </Box>
        <Box gap="small">
          <Heading level={4} margin="none">
            {node.frontmatter.title}
          </Heading>
          <Paragraph margin="none">
            {node.frontmatter.description || stripMarkdown(node.excerpt)}
          </Paragraph>
        </Box>
      </Box>
      {node.frontmatter.thumbnailimage && (
        <Box pad={{ vertical: 'large', horizontal: 'xlarge' }}>
          <Image
            height="300"
            width="300"
            fit="contain"
            src={node.frontmatter.thumbnailimage}
            alt="thumbnail logo"
          />
        </Box>
      )}
    </Box>
  </GrommetCard>
);

FeaturedBlogCard.propTypes = BlogCard.propTypes;

export const SectionHeader = ({ color, title, children }) => {
  return (
    <Box flex={false} margin="medium">
      <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
        {title && (
          <Heading margin="none" level="2">
            {title}
          </Heading>
        )}
      </Box>
      <Box
        border={{ side: 'top', color, size: 'small' }}
        pad={{ top: 'small' }}
      >
        {children}
      </Box>
    </Box>
  );
};

SectionHeader.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
