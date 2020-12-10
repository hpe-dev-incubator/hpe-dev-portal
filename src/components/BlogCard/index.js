import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import strip from 'strip-markdown';
import { Box, Heading, Paragraph, Markdown, Text } from 'grommet';
import { Link } from '..';

const dateFormat = Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const stripMarkdown = markdown => {
  let text = markdown;
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      text = file.contents;
    });
  return text;
};

export const BlogCard = ({ node, ...rest }) => (
  <Box
    margin={{
      left: 'large',
      right: 'large',
    }}
    pad={{
      bottom: 'large',
      top: 'large',
    }}
    gap="medium"
    border={{
      side: 'bottom',
      color: 'light-2',
      size: 'medium',
    }}
    justify="center"
    {...rest}
  >
    <Box>
      {node.frontmatter.date && node.frontmatter.author && (
        <Markdown>
          {`${dateFormat.format(new Date(node.frontmatter.date))} by **${
            node.frontmatter.author
          }**`}
        </Markdown>
      )}
      <Heading
        level={2}
        size="large"
        margin={{ top: 'none', bottom: 'xsmall' }}
      >
        {node.frontmatter.title}
      </Heading>
      {node.frontmatter.version && (
        <Text size="small" color="neutral-4">
          {node.frontmatter.version}
        </Text>
      )}
    </Box>
    <Box width="large">
      <Paragraph margin="none">
        {node.frontmatter.description || stripMarkdown(node.excerpt)}
      </Paragraph>
    </Box>
    <Link
      to={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
      label="Read more >"
    />
  </Box>
);

BlogCard.propTypes = {
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
      version: PropTypes.string,
    }).isRequired,
    excerpt: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      sourceInstanceName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default BlogCard;
