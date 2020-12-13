import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import remark from 'remark';
import strip from 'strip-markdown';
import { Box, Heading, Paragraph, Text } from 'grommet';
import { Link as GatsbyLink } from 'gatsby';

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

export const BlogCard = ({ node, ...rest }) => (
  <Box
    pad="large"
    width="large"
    direction="row"
    justify="between"
    {...rest}
    elevation="medium"
    wrap
  >
    <NavLink to={`${node.path || node.frontmatter.path}`}>
      <Box pad="small">
        <Heading
          level={4}
          margin={{ top: 'none', bottom: 'xsmall' }}
          color="text"
        >
          {node.title || node.frontmatter.title}
        </Heading>
        <Paragraph margin="none" color="border">
          {node.description || stripMarkdown(node.excerpt)}
        </Paragraph>
        {/* {node.frontmatter.version && (
          <Text size="small" color="neutral-4">
            {node.frontmatter.version}
          </Text>
        )} */}
      </Box>
      <Box direction="row" pad="small" width="large">
        <Box>
          {(node.author || node.frontmatter.author) && (
            <Text color="text" weight="bold">
              {node.author || node.frontmatter.author}
            </Text>
          )}
          {(node.date || node.frontmatter.date) && (
            <Text color="border">
              {`${dateFormat.format(
                new Date(node.date || node.frontmatter.date),
              )}`}
            </Text>
          )}
        </Box>
      </Box>
    </NavLink>
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
      path: PropTypes.string,
    }),
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    version: PropTypes.string,
    path: PropTypes.string,
    excerpt: PropTypes.string,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      sourceInstanceName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default BlogCard;
