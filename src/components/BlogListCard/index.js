import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';
import { LinkNext } from 'grommet-icons';
import { useLocalStorage } from '../../hooks/use-local-storage';

export const FONT = "'HPE Graphik', 'Metric', Arial, sans-serif";

// Blog nodes come in two shapes: GraphQL nodes (frontmatter) and the
// flattened nodes of the paginated collections. Normalize both.
export const getBlogLink = (node) => {
  const externalLink = node?.externalLink || node?.frontmatter?.externalLink;
  if (externalLink) return { href: externalLink, external: true };
  const slug = node?.fields?.slug;
  const source = node?.fields?.sourceInstanceName;
  if (slug && source) return { href: `/${source}${slug}`, external: false };
  return { href: null, external: false };
};

export const getBlogInfo = (node) => ({
  title: node?.title || node?.frontmatter?.title,
  author: node?.author || node?.frontmatter?.author,
  authorimage: node?.authorimage || node?.frontmatter?.authorimage,
});

export const BlogAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-family: ${FONT};
  font-size: 16px;
  line-height: 24px;
  color: #292d3a;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #d5d5d5;
  }
`;

export const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #006750;
`;

const Card = styled(GatsbyLink)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;
  padding: 32px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;

  &:hover h4,
  &:focus-visible h4 {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #01a982;
    outline-offset: 2px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  h4 {
    margin: 0;
    font-family: ${FONT};
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0.2px;
    color: #292d3a;
    overflow-wrap: anywhere;
  }
`;

const BlogListCard = ({ node }) => {
  // eslint-disable-next-line no-unused-vars
  const [blogPosition, setBlogPosition] = useLocalStorage('blogPosition');
  const { href, external } = getBlogLink(node);
  const { title, author, authorimage } = getBlogInfo(node);
  if (!href) return null;

  const content = (
    <>
      <CardText>
        {author && (
          <BlogAuthor>
            {authorimage && <img src={authorimage} alt="" />}
            <span>{author}</span>
          </BlogAuthor>
        )}
        <h4>{title}</h4>
      </CardText>
      <ReadMore>
        Read
        <LinkNext size="small" color="#006750" />
      </ReadMore>
    </>
  );

  return external ? (
    <Card as="a" href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </Card>
  ) : (
    <Card to={href} onClick={() => setBlogPosition(window.scrollY)}>
      {content}
    </Card>
  );
};

BlogListCard.propTypes = {
  node: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    authorimage: PropTypes.string,
    externalLink: PropTypes.string,
    frontmatter: PropTypes.shape({
      title: PropTypes.string,
      author: PropTypes.string,
      authorimage: PropTypes.string,
      externalLink: PropTypes.string,
    }),
    fields: PropTypes.shape({
      slug: PropTypes.string,
      sourceInstanceName: PropTypes.string,
    }),
  }).isRequired,
};

export default BlogListCard;
