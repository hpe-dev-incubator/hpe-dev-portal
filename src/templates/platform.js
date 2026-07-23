import React from 'react';
import { graphql, Link } from 'gatsby';
import { Anchor, Box, Text } from 'grommet';
import { Book, Catalog, CircleQuestion, FormPreviousLink } from 'grommet-icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  BlogCard,
  ButtonLink,
  Card,
  Content,
  LayoutSideBar,
  Markdown,
  ResponsiveGrid,
  SectionHeader,
  SEO,
} from '../components';
import PlatformHeroSectionGrommet from '../components/PlatformHeroSectionGrommet';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  max-width: 988px;
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  .button {
    background-color: rgba(23, 235, 160, 1);
    box-sizing: border-box;
    color: #000000;
    font-size: 18px;
    display: inline-block;
    padding: 6px 12px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
    border: none;
    margin: 0;
    line-height: 24px;
    font-weight: 700;
  }

  .resource-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin: 24px 0;
  }
  .resource-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
  .resource-card-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0faf6;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  .resource-card-icon svg {
    width: 28px;
    height: 28px;
  }
  .resource-card-title {
    font-weight: 700;
    font-size: 15px;
    color: #1a1a1a;
  }
  .resource-card-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.5;
    flex: 1;
  }
  .resource-card-link {
    color: #17eba0 !important;
    text-decoration: none !important;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }
  .resource-card-link:hover {
    text-decoration: underline !important;
  }
`;

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

const CARD_ICONS = [Catalog, Book, CircleQuestion];

// Extract the first plain-text paragraph from raw markdown as the hero description,
// skipping any leading <style>...</style> blocks, headings, or list items.
function extractDescriptionAndBody(rawBody) {
  const lines = rawBody.split('\n');
  const descLines = [];
  let bodyStartIdx = 0;
  let inDesc = false;
  let inStyle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track <style>...</style> blocks and skip them entirely
    if (!inDesc && !inStyle && /^<style\b/i.test(trimmed)) {
      inStyle = true;
      continue;
    }
    if (inStyle) {
      if (/<\/style>/i.test(trimmed)) inStyle = false;
      continue;
    }

    // Skip blank lines before content starts
    if (!inDesc && !trimmed) continue;
    // Skip headings, list items, and other HTML tags
    if (!inDesc && /^[#*<]/.test(trimmed)) {
      bodyStartIdx = i;
      break;
    }
    if (!inDesc) {
      inDesc = true;
      bodyStartIdx = i;
    }
    // Blank line ends the first paragraph
    if (inDesc && !trimmed) {
      bodyStartIdx = i + 1;
      break;
    }
    descLines.push(trimmed);
  }

  return {
    description: descLines.join(' '),
    body: lines.slice(bodyStartIdx).join('\n'),
  };
}

// Generate anchor ID matching gatsby-remark-autolink-headers (github-slugger)
function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Parse top-level # headings from raw markdown body to build sidebar nav items
function parseHeadingsForSidebar(rawBody) {
  const items = [];
  for (const line of rawBody.split('\n')) {
    const match = line.match(/^# (.+)/);
    if (match) {
      const text = match[1]
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      if (text) items.push({ label: text, href: `#${slugifyHeading(text)}` });
    }
  }
  return items;
}

// Find the first group of 2+ consecutive `* [text](url)` bullet links,
// extract them as resource cards, and return bodyBefore/bodyAfter so the
// cards can be inserted at exactly the right position in the page.
function parseAndExtractBulletCards(rawBody) {
  const lines = rawBody.split('\n');
  let groupStart = -1;
  let groupLen = 0;
  let cards = [];
  let curStart = -1;
  let curCards = [];

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\* \[([^\]]+)\]\(([^)]+)\)/);
    if (m) {
      if (curStart === -1) curStart = i;
      curCards.push({ title: m[1], link: m[2] });
    } else {
      if (curCards.length >= 2) {
        groupStart = curStart;
        groupLen = curCards.length;
        cards = curCards;
        break;
      }
      curStart = -1;
      curCards = [];
    }
  }
  if (groupStart === -1 && curCards.length >= 2) {
    groupStart = curStart;
    groupLen = curCards.length;
    cards = curCards;
  }
  if (groupStart === -1) return { cards: [], bodyBefore: rawBody, bodyAfter: '' };

  return {
    cards,
    bodyBefore: lines.slice(0, groupStart).join('\n'),
    bodyAfter: lines.slice(groupStart + groupLen).join('\n'),
  };
}
function renderMenu(items) {
  if (!items) return null;
  return (
    <ul className="sidebar">
      {items.map((item, index) =>
        item.separator ? (
          <li key={index} className="separator">
            <hr style={{ border: '1px solid #ccc', margin: '2px 0' }} />
          </li>
        ) : (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
            {item.items && item.items.length > 0 && renderMenu(item.items)}
          </li>
        )
      )}
    </ul>
  );
}
function PlatformTemplate({ data }) {
  const post = data.markdownRemark;
  const { edges: blogs } = data.blogs;
  const { edges: events } = data.events;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  const { rawMarkdownBody, excerpt } = post;
  const { title, description, tags } = post.frontmatter;

  // Split off the first paragraph as the hero description
  const { description: heroDescription, body: bodyWithoutDesc } = extractDescriptionAndBody(rawMarkdownBody);
  // Auto-parse sidebar nav from headings; auto-extract bullet link cards from remaining body
  const parsedSidebarItems = parseHeadingsForSidebar(bodyWithoutDesc);
  const { cards: activeCards, bodyBefore, bodyAfter } = parseAndExtractBulletCards(bodyWithoutDesc);
  const sidebarItems = parsedSidebarItems;

  const hero = (
    <PlatformHeroSectionGrommet
      title={title}
      description={heroDescription}
      navItems={sidebarItems}
    />
  );

  const content =(
    <>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="auto" gap="12px" pad="small">
        <Box flex={false} direction="row-responsive">
          <Box pad={{ vertical: 'large', horizontal: 'xlarge' }}>
            {/* <Image
                width="216px"
                height="216px"
                src={image}
                alt="platform logo"
              /> */}
          </Box>
          <Content id="platform-content" gap="12px" margin={{ vertical: 'large' }}>
            <Box direction="row" align="center" gap="xsmall" margin={{ bottom: 'small' }}>
              <Link to="/platforms" style={{ textDecoration: 'none' }}>
                <Text color="brand" size="small">{title}</Text>
              </Link>
              <Text size="small" color="dark-4">/</Text>
              <Text size="small" color="dark-4">Getting started</Text>
            </Box>
            <MarkdownLayout>{bodyBefore}</MarkdownLayout>
            {activeCards.length > 0 && (
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '16px',
                  margin: '16px 0',
                  width: '100%',
                }}
              >
                {activeCards.map((card, i) => {
                  const Icon = CARD_ICONS[i % CARD_ICONS.length];
                  return (
                    <Box
                      key={i}
                      border={{ color: 'light-4' }}
                      round="small"
                      pad="medium"
                      background="white"
                      elevation="xsmall"
                      gap="small"
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Box
                        pad="small"
                        background="light-1"
                        round="small"
                        width="48px"
                        height="48px"
                        align="center"
                        justify="center"
                      >
                        <Icon size="medium" color="brand" />
                      </Box>
                      <Text weight="bold" size="small">{card.title}</Text>
                      <Text size="xsmall" color="dark-4" style={{ flex: 1 }}>
                        {card.description}
                      </Text>
                      <Anchor
                        href={card.link}
                        label="Explore more →"
                        color="brand"
                        size="small"
                        style={{ fontWeight: 600, marginTop: '8px' }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
            {bodyAfter && <MarkdownLayout>{bodyAfter}</MarkdownLayout>}
            {blogs.length > 0 && tags && (
              <SectionHeader title="Related Blogs" color="border">
                <ResponsiveGrid gap="large" rows={rows} columns={columns}>
                  {blogs.map(({ node }, i) => {
                    return node &&
                      (node.frontmatter.authorimage ||
                        node.frontmatter.author) ? (
                      <BlogCard node={node} key={i} margin="none" />
                    ) : undefined;
                  })}
                </ResponsiveGrid>
              </SectionHeader>
            )}
            {events.length > 0 && tags && (
              <SectionHeader title="Related Events" color="border">
                {events.map(({ node }) => {
                  return (
                    node && (
                      <Card
                        key={node.id}
                        category={node.frontmatter.category}
                        width={node.frontmatter.width}
                        content={node.rawMarkdownBody}
                        link={node.frontmatter.link}
                        image={node.frontmatter.image}
                        basis="auto"
                      />
                    )
                  );
                })}
              </SectionHeader>
            )}
          </Content>
        </Box>
        <Box alignSelf="start">
          <ButtonLink
            icon={<FormPreviousLink />}
            label="Go to Platforms Page"
            to="/platforms"
          />
        </Box>
      </Box>
    </>
  )
  return (
    <LayoutSideBar
      title={siteTitle}
      sectionTitle="Getting started"
      sidebarContent={sidebarItems.length > 0 ? renderMenu(sidebarItems) : null}
      heroContent={hero}
    >
      {content}
    </LayoutSideBar>
  );
}

PlatformTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    markdownRemark: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        version: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),

      }).isRequired,
      fields: PropTypes.shape({
        slug: PropTypes.string.isRequired,
      }),
    }).isRequired,
    blogs: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string,
              date: PropTypes.string,
              authorimage: PropTypes.string,
              externalLink: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }),
      ),
    }),
    events: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              link: PropTypes.string.isRequired,
              image: PropTypes.string,
              category: PropTypes.string,
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
    aside: PropTypes.shape({
      rawMarkdownBody: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        isAside: PropTypes.bool,
      }),
    }),
  }).isRequired,
};

export default PlatformTemplate;

export const pageQuery = graphql`
  query PlatformBySlug($slug: String!, $tagRE: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      rawMarkdownBody
      frontmatter {
        title
        version
        description
        image
        tags
      }
      fields {
        slug
      }
    }
    blogs: allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { tags: { regex: $tagRE }, disable: { eq: false } }
        fields: { sourceInstanceName: { eq: "blog" } }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            sourceInstanceName
          }
          frontmatter {
            title
            author
            date
            authorimage
            externalLink
          }
          excerpt(format: MARKDOWN)
        }
      }
    }
    events: allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { tags: { regex: $tagRE } }
        fields: { sourceInstanceName: { eq: "event" } }
        isUpcoming: { eq: true }
      }
    ) {
      totalCount
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
            image
            category
            dateEnd
            link
            width
          }
        }
      }
    }
    aside: markdownRemark(
      frontmatter: { tags: { regex: $tagRE }, isAside: { eq: true } }
    ) {
      id
      excerpt
      rawMarkdownBody
    }
  }
`;
