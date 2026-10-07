import { graphql, navigate } from 'gatsby';
import { Anchor, Avatar, Box, Button, Heading, Paragraph, Text } from 'grommet';
import { Book, Catalog, CircleQuestion, Copy, FormNextLink, FormPreviousLink, HelpBook } from 'grommet-icons';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  ButtonLink,
  Card,
  Content,
  LayoutSideBar,
  Markdown,
  SectionHeader,
  SEO
} from '../components';
import PlatformHeroSectionGrommet from '../components/PlatformHeroSectionGrommet';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  max-width: 100%;
  width: 100%;
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  .button {
    background-color: #292D3A;
    color: #FFFFFF;
    font-size: 18px;
    display: inline-block;
    padding: 6px 12px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 90px;
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

const platformHeadingStyles = {
  h1: {
    component: Heading,
    props: {
      level: 1,
      style: {
        fontSize: 'clamp(28px, 3vw, 40px)',
        fontWeight: 500,
        lineHeight: 'clamp(34px, 3.4vw, 48px)',
        letterSpacing: 'clamp(-0.4px, -0.02em, -1.2px)',
      },
    },
  },
  h2: {
    component: Heading,
    props: {
      level: 2,
      style: {
        fontSize: 'clamp(24px, 2.5vw, 32px)',
        fontWeight: 500,
        lineHeight: 'clamp(30px, 3vw, 38px)',
        letterSpacing: 'clamp(-0.24px, -0.02vw, -0.8px)',
      },
    },
  },
  h3: {
    component: Heading,
    props: {
      level: 3,
      style: {
        fontSize: 'clamp(20px, 2.1vw, 26px)',
        fontWeight: 500,
        lineHeight: 'clamp(26px, 2.8vw, 32px)',
        letterSpacing: 'clamp(0px, -0.01vw, -0.24px)',
      },
    },
  },
  h4: {
    component: Heading,
    props: {
      level: 4,
      style: {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '-0.18px',
      },
    },
  },
  p: {
    component: Paragraph,
    props: {
      fill: true,
      style: {
        width: '100%',
        maxWidth: 'none',
      },
    },
  },
};

const BLOGS_PER_PAGE = 3;

const CARD_ICONS = [Catalog, Book, CircleQuestion];

const DOC_CARD_CATEGORY = {
  GUIDE: 'guide',
  DOCS: 'docs',
  FAQ: 'faq',
  OTHER: 'other',
};

const DOC_CARD_MATCHERS = {
  [DOC_CARD_CATEGORY.GUIDE]: [
    /developer\s+guide/i,
    /dev\s*guide/i,
    /design\s+doc/i,
    /design\s+guide/i,
    /integration\s+guide/i,
    /implementation\s+guide/i,
    /sdk\s+guide/i,
  ],
  [DOC_CARD_CATEGORY.DOCS]: [
    /documentation/i,
    /\bdocs\b/i,
    /api\s+reference/i,
    /openapi/i,
    /spec(?:ification)?/i,
    /reference/i,
  ],
  [DOC_CARD_CATEGORY.FAQ]: [
    /\bfaq\b/i,
    /q\s*&\s*a/i,
    /common\s+questions/i,
    /troubleshooting/i,
  ],
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

function normalizeDocTypeTag(rawType = '') {
  const value = rawType.trim().toLowerCase();
  if (!value) return '';

  const typeMap = {
    guide: DOC_CARD_CATEGORY.GUIDE,
    developer: DOC_CARD_CATEGORY.GUIDE,
    'developer-guide': DOC_CARD_CATEGORY.GUIDE,
    'developer_guide': DOC_CARD_CATEGORY.GUIDE,
    docs: DOC_CARD_CATEGORY.DOCS,
    doc: DOC_CARD_CATEGORY.DOCS,
    documentation: DOC_CARD_CATEGORY.DOCS,
    faq: DOC_CARD_CATEGORY.FAQ,
  };

  return typeMap[value] || '';
}

function classifyDocCard({ type = '', title = '', description = '', link = '' }) {
  const explicitType = normalizeDocTypeTag(type);
  if (explicitType) return explicitType;

  const text = `${title} ${description} ${link}`.trim();
  if (!text) return DOC_CARD_CATEGORY.OTHER;

  for (const category of [DOC_CARD_CATEGORY.GUIDE, DOC_CARD_CATEGORY.DOCS, DOC_CARD_CATEGORY.FAQ]) {
    if (DOC_CARD_MATCHERS[category].some((pattern) => pattern.test(text))) {
      return category;
    }
  }

  return DOC_CARD_CATEGORY.OTHER;
}

function normalizeDocCardTitle(title) {
  const category = classifyDocCard({ title });
  if (category === DOC_CARD_CATEGORY.GUIDE) return 'Developer Guide';
  if (category === DOC_CARD_CATEGORY.DOCS) return 'Documentation';
  if (category === DOC_CARD_CATEGORY.FAQ) return 'FAQ';
  return title;
}

function getCardDisplayTitle(card) {
  if (normalizeDocTypeTag(card.type)) {
    return card.title;
  }

  return normalizeDocCardTitle(card.title);
}

function getCardIcon(card, index) {
  const category = classifyDocCard(card);
  if (category === DOC_CARD_CATEGORY.GUIDE) return Copy;
  if (category === DOC_CARD_CATEGORY.DOCS) return Book;
  if (category === DOC_CARD_CATEGORY.FAQ) return HelpBook;
  return CARD_ICONS[index % CARD_ICONS.length];
}

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
    body: rawBody,
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

// Parse level-2 (##) headings from raw markdown body to build sidebar nav items.
function parseHeadingsForSidebar(rawBody) {
  const items = [];
  for (const line of rawBody.split('\n')) {
    const match = line.match(/^##\s+(.+)/);
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
  const groups = [];
  const taggedBulletPattern = /^\*\s+\[([^\]]+)\]\s*\[([^\]]+)\]\(([^)]+)\)\s*$/;
  const legacyBulletPattern = /^\*\s+\[([^\]]+)\]\(([^)]+)\)\s*$/;

  const parseBullet = (line) => {
    const taggedMatch = line.match(taggedBulletPattern);
    if (taggedMatch) {
      return {
        type: taggedMatch[1].trim(),
        title: taggedMatch[2].trim(),
        link: taggedMatch[3].trim(),
      };
    }

    const legacyMatch = line.match(legacyBulletPattern);
    if (legacyMatch) {
      return {
        type: '',
        title: legacyMatch[1].trim(),
        link: legacyMatch[2].trim(),
      };
    }

    return null;
  };

  let i = 0;
  while (i < lines.length) {
    const bullet = parseBullet(lines[i]);
    if (!bullet) {
      i += 1;
      continue;
    }

    const start = i;
    const cards = [];

    while (i < lines.length) {
      const parsedLine = parseBullet(lines[i]);
      if (!parsedLine) break;

      const { type, title, link } = parsedLine;
      const descriptionLines = [];
      i += 1;

      while (i < lines.length) {
        const nextLine = lines[i];
        const trimmed = nextLine.trim();

        if (parseBullet(trimmed)) break;
        if (trimmed === '') {
          let lookahead = i + 1;
          while (lookahead < lines.length && lines[lookahead].trim() === '') lookahead += 1;
          if (lookahead < lines.length && parseBullet(lines[lookahead].trim())) {
            i = lookahead;
            break;
          }
          i = lookahead;
          break;
        }

        descriptionLines.push(trimmed);
        i += 1;
      }

      cards.push({
        type,
        title,
        link,
        description: descriptionLines.join(' '),
      });

      if (i >= lines.length || !parseBullet(lines[i].trim())) break;
    }

    const nextIndex = i;
    if (cards.length >= 2) {
      const typedTagHits = cards.reduce((acc, card) => acc + (normalizeDocTypeTag(card.type) ? 1 : 0), 0);
      const docTagHits = cards.reduce((acc, card) => {
        const category = classifyDocCard(card);
        return acc + (category !== DOC_CARD_CATEGORY.OTHER ? 1 : 0);
      }, 0);
      groups.push({
        start,
        nextIndex,
        cards,
        typedTagHits,
        docTagHits,
      });
    }
  }

  if (groups.length === 0) {
    return { cards: [], bodyBefore: rawBody, bodyAfter: '' };
  }

  const taggedPreferredGroup = groups
    .filter((group) => group.typedTagHits > 0)
    .sort((a, b) => b.typedTagHits - a.typedTagHits || b.docTagHits - a.docTagHits)[0];

  const inferredPreferredGroup = groups
    .filter((group) => group.docTagHits > 0)
    .sort((a, b) => b.docTagHits - a.docTagHits)[0];

  const preferredGroup = taggedPreferredGroup || inferredPreferredGroup;

  if (!preferredGroup) {
    return { cards: [], bodyBefore: rawBody, bodyAfter: '' };
  }

  return {
    cards: preferredGroup.cards,
    bodyBefore: lines.slice(0, preferredGroup.start).join('\n'),
    bodyAfter: lines.slice(preferredGroup.nextIndex).join('\n'),
  };
}

// Split platform body into intro (before first level-2 heading) and the rest.
function splitIntroSection(rawBody) {
  const lines = rawBody.split('\n');
  const firstHeadingIndex = lines.findIndex((line) => /^##\s+/.test(line.trim()));

  if (firstHeadingIndex === -1) {
    return { intro: rawBody, rest: '' };
  }

  return {
    intro: lines.slice(0, firstHeadingIndex).join('\n').trim(),
    rest: lines.slice(firstHeadingIndex).join('\n').trim(),
  };
}

// Remove raw <link ...> tags from markdown body to avoid browser DOM relocation
// that can cause React reconciliation errors on hash-driven rerenders.
function sanitizeMarkdownBody(rawBody) {
  return rawBody
    .split('\n')
    .filter((line) => !/^\s*<link\b/i.test(line.trim()))
    .join('\n');
}

// Strip HTML tags, markdown formatting, and style blocks from text content
// Returns plain text only for display in excerpts
function stripMarkdownAndHTML(text) {
  if (!text) return '';
  return text
    // Remove <style>...</style> blocks
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown links [text](url) -> text (and handle empty links [](url))
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove heading markers (#, ##, ###, etc.)
    .replace(/^#+\s*/gm, '')
    // Remove markdown bold/italic markers
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove remaining ** or __ markers that weren't caught
    .replace(/[\*_]+/g, '')
    // Remove leading/trailing whitespace and collapse multiple spaces
    .trim()
    .replace(/\s+/g, ' ');
}

function renderMenu(items, activeHref, onLinkClick, keyPrefix = 'root') {
  if (!items) return null;
  return (
    <ul className="sidebar">
      {items.map((item, index) =>
        item.separator ? (
          <li key={`${keyPrefix}-sep-${index}`} className="separator">
            <hr style={{ border: '1px solid #ccc', margin: '2px 0' }} />
          </li>
        ) : (
          <li key={`${keyPrefix}-${item.href || item.label || index}`}>
            <a
              href={item.href}
              className={item.href === activeHref ? 'active' : ''}
              onClick={(event) => onLinkClick(event, item.href)}
            >
              {item.label}
            </a>
            {item.items &&
              item.items.length > 0 &&
              renderMenu(item.items, activeHref, onLinkClick, `${keyPrefix}-${item.href || index}`)}
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
  const sanitizedBody = sanitizeMarkdownBody(bodyWithoutDesc);
  // Build dedicated intro section and keep remaining markdown sections unchanged.
  const { intro: introBody, rest: sectionBody } = splitIntroSection(sanitizedBody);
  // Auto-parse sidebar nav from headings; auto-extract bullet link cards from remaining body
  const parsedSidebarItems = useMemo(
    () => parseHeadingsForSidebar(sectionBody),
    [sectionBody],
  );
  const { cards: activeCards, bodyBefore, bodyAfter } = parseAndExtractBulletCards(sectionBody);
  const sidebarItems = useMemo(
    () => [
      { label: 'Getting started', href: '#platform-content' },
      ...parsedSidebarItems,
    ],
    [parsedSidebarItems],
  );
  const [activeSidebarHref, setActiveSidebarHref] = useState(sidebarItems[0]?.href || '');
  const relatedBlogs = useMemo(
    () =>
      blogs
        .map(({ node }) => node)
        .filter((node) => node && (node.frontmatter.authorimage || node.frontmatter.author)),
    [blogs],
  );
  const [currentBlogPage, setCurrentBlogPage] = useState(0);
  const blogPageCount = Math.ceil(relatedBlogs.length / BLOGS_PER_PAGE);
  const pagedBlogs = useMemo(() => {
    const start = currentBlogPage * BLOGS_PER_PAGE;
    return relatedBlogs.slice(start, start + BLOGS_PER_PAGE);
  }, [currentBlogPage, relatedBlogs]);

  useEffect(() => {
    if (blogPageCount === 0) {
      if (currentBlogPage !== 0) setCurrentBlogPage(0);
      return;
    }

    if (currentBlogPage > blogPageCount - 1) {
      setCurrentBlogPage(blogPageCount - 1);
    }
  }, [blogPageCount, currentBlogPage]);

  const navigateToHash = (href) => {
    if (typeof window === 'undefined' || !href) return;

    window.history.replaceState(null, '', href);

    const id = href.startsWith('#') ? href.slice(1) : '';
    if (!id) return;

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getActiveHref = () => window.location.hash || sidebarItems[0]?.href || '';

    setActiveSidebarHref(getActiveHref());

    const onHashChange = () => {
      setActiveSidebarHref(getActiveHref());
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [sidebarItems]);

  useEffect(() => {
    if (typeof window === 'undefined' || !activeSidebarHref) return;

    // Find the active sidebar link and scroll it into view
    const activeLink = document.querySelector(`.sidebar a[href="${activeSidebarHref}"]`);
    const sidebarContainer = document.querySelector('.sidebar-content');
    
    if (activeLink && sidebarContainer) {
      const linkTop = activeLink.offsetTop;
      const linkHeight = activeLink.offsetHeight;
      const containerHeight = sidebarContainer.clientHeight;
      
      // Scroll to position the active link in the middle of the visible area
      const scrollPosition = linkTop - (containerHeight / 2) + (linkHeight / 2);
      sidebarContainer.scrollTop = Math.max(0, scrollPosition);
    }
  }, [activeSidebarHref]);

  const handleSidebarLinkClick = (event, href) => {
    event.preventDefault();
    setActiveSidebarHref(href);

    navigateToHash(href);
  };

  const handleNavLinkClick = (event, href) => {
    event.preventDefault();
    setActiveSidebarHref(href);

    navigateToHash(href);
  };

  const handleHeroHashChange = (href) => {
    setActiveSidebarHref(href);
  };

  const openBlog = (node) => {
    const externalLink = node?.externalLink || node?.frontmatter?.externalLink;
    if (externalLink) {
      if (typeof window !== 'undefined') {
        window.open(externalLink, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (node?.fields?.slug && node?.fields?.sourceInstanceName) {
      navigate(`/${node.fields.sourceInstanceName}${node.fields.slug}`);
    }
  };

  const hero = (
    <PlatformHeroSectionGrommet
      title={title}
      description={heroDescription}
      navItems={parsedSidebarItems}
      activeHref={activeSidebarHref}
      onNavClick={handleNavLinkClick}
      onActiveHrefChange={handleHeroHashChange}
    />
  );

  const content =(
    <>
      <SEO title={title} description={description || excerpt} />
      <Box flex overflow="visible" gap="10px" pad={{ top: '0', right: 'small', bottom: 'small', left: 'small' }}>
        <Box flex={false} direction="row-responsive" align="start">
          <Box pad="none">
            {/* <Image
                width="216px"
                height="216px"
                src={image}
                alt="platform logo"
              /> */}
          </Box>
          <Content id="platform-content" gap="8px"
          style={{
            marginTop: '-12px',
            width: '100%',
            maxWidth: '1192px',
          }}>
              <Box
                direction="row"
                align="center"
                gap="16px"
                width="100%"
                height="50px"
                style={{
                  minHeight: '64px',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  borderRadius: '16px',
                  opacity: 1,
                }}
              >
                <Box direction="row" align="center" gap="small">
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '24px',
                      letterSpacing: '0px',
                      color: '#606A70',
                      fontFamily: 'HPE Graphik, Metric, sans-serif',
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                      color: '#606A70',
                      fontSize: '20px',
                      lineHeight: '24px',
                      fontFamily: 'HPE Graphik, Metric, sans-serif',
                    }}
                  >
                    /
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '24px',
                      letterSpacing: '0px',
                      color: '#3E4550',
                      fontFamily: 'HPE Graphik, Metric, sans-serif',
                    }}
                  >
                    Getting Started
                  </Text>
                </Box>
              </Box>
              <Text
                as="h1"
                size="72px"
                weight={500}
                color="#292D3A"
                style={{ lineHeight: '100%', margin: 0 }}
              >
                {title}
              </Text>
              {introBody && <MarkdownLayout components={platformHeadingStyles}>{introBody}</MarkdownLayout>}
            {bodyBefore && <MarkdownLayout components={platformHeadingStyles}>{bodyBefore}</MarkdownLayout>}
            {activeCards.length > 0 && (
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '30px',
                  margin: '20px 0 30px',
                  width: '100%',
                }}
              >
                {activeCards.map((card, i) => {
                  const Icon = getCardIcon(card, i);
                  const isGuideCard = classifyDocCard(card) === DOC_CARD_CATEGORY.GUIDE;
                  return (
                    <Box
                      key={`${card.link}-${i}`}
                      pad="none"
                      background="transparent"
                      elevation="none"
                      gap="small"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '385px',
                        // height: 'auto',
                        gap: '20px',
                        boxSizing: 'border-box',
                        paddingTop: '40px',
                        paddingRight: '28px',
                        paddingBottom: '40px',
                        paddingLeft: '28px',
                        borderRadius: '0px',
                        background: isGuideCard
                          ? 'radial-gradient(90% 55% at 100% 100%, rgba(121, 233, 218, 0.58) 0%, rgba(191, 245, 236, 0.38) 32%, rgba(247, 247, 247, 0) 72%), linear-gradient(180deg, rgba(247, 247, 247, 0) 0%, rgba(121, 233, 218, 0.06) 100%), #f7f7f7'
                          : '#f7f7f7',
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04) inset',
                      }}
                    >
                      <Box
                        pad="none"
                        background="transparent"
                        round="0px"
                        width="48px"
                        height="48px"
                        align="start"
                        justify="start"
                        style={{ marginBottom: '8px' }}
                      >
                        <Icon size="large" color="#3e4550" />
                      </Box>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          flex: 1,
                          minHeight: 0,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            fontSize: '22px',
                            width: '100%',
                            lineHeight: '26px',
                            color: '#292D3A',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                            fontFamily: 'HPE Graphik, Metric, sans-serif',
                          }}
                        >
                          {getCardDisplayTitle(card)}
                        </Text>
                        <Text
                          style={{
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#606A70',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                            fontFamily: 'HPE Graphik, Metric, sans-serif',
                          }}
                        >
                          {card.description}
                        </Text>
                      </Box>
                      <Anchor
                        href={card.link}
                        label="Explore more →"
                        color="#1b8f76"
                        size="small"
                        style={{
                          fontWeight: 600,
                          marginTop: 'auto',
                          fontSize: '18px',
                          lineHeight: '24px',
                          whiteSpace: 'normal',
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
            {bodyAfter && <MarkdownLayout components={platformHeadingStyles}>{bodyAfter}</MarkdownLayout>}
            {bodyAfter && <MarkdownLayout>{bodyAfter}</MarkdownLayout>} 
            {relatedBlogs.length > 0 && tags && (
              <Box margin={{ top: '36px', bottom: '36px' }} pad={{ horizontal: 'medium' }}>
                <Heading
                  level={2}
                  margin={{ top: '0', bottom: '36px' }}
                  style={{
                    fontSize: '54px',
                    lineHeight: '60px',
                    fontWeight: 500,
                    letterSpacing: '-0.8px',
                    color: '#2f3244',
                  }}
                >
                  Related blogs
                </Heading>

                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '32px',
                    width: '100%',
                  }}
                >
                  {pagedBlogs.map((node, index) => (
                    <Box
                      key={`${node.fields?.slug || node.frontmatter?.title || 'blog'}-${index}`}
                      background="#f7f7f7"
                      pad={{ top: '36px', right: '32px', bottom: '30px', left: '32px' }}
                      style={{
                        height: '450px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Heading
                        level={3}
                        margin={{ top: '0', bottom: '18px' }}
                        style={{
                          fontSize: '22px',
                          lineHeight: '34px',
                          fontWeight: 500,
                          color: '#2f3244',
                          letterSpacing: '-0.4px',
                        }}
                      >
                        {node.frontmatter.title}
                      </Heading>

                      {(node.frontmatter.authorimage || node.frontmatter.author) && (
                        <Box direction="row" align="center" gap="small" margin={{ bottom: '20px' }}>
                          {node.frontmatter.authorimage && (
                            <Avatar
                              size="34px"
                              src={node.frontmatter.authorimage}
                              alt={node.frontmatter.author || 'Author'}
                            />
                          )}
                          {node.frontmatter.author && (
                            <Text
                              style={{
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#545a6b',
                              }}
                            >
                              by {node.frontmatter.author}
                            </Text>
                          )}
                        </Box>
                      )}

                      <Text
                        style={{
                          fontSize: '18px',
                          lineHeight: '34px',
                          color: '#5f6676',
                          flex: 1,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {stripMarkdownAndHTML(node.excerpt)}
                      </Text>

                      <Anchor
                        href={node.frontmatter.externalLink || `/${node.fields.sourceInstanceName}${node.fields.slug}`}
                        onClick={(event) => {
                          event.preventDefault();
                          openBlog(node);
                        }}
                        label="Read more  →"
                        color="#178972"
                        size="small"
                        style={{
                          marginTop: '24px',
                          fontWeight: 600,
                          fontSize: '18px',
                          lineHeight: '26px',
                          textDecoration: 'none',
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {blogPageCount > 1 && (
                  <Box direction="row" gap="small" margin={{ top: '28px' }}>
                    <Button
                      plain
                      disabled={currentBlogPage === 0}
                      onClick={() => setCurrentBlogPage((page) => Math.max(0, page - 1))}
                      icon={
                        <Box
                          width="56px"
                          height="56px"
                          round="full"
                          align="center"
                          justify="center"
                          background={currentBlogPage === 0 ? '#d6dce6' : '#4e5668'}
                        >
                          <FormPreviousLink color="#ffffff" size="medium" />
                        </Box>
                      }
                    />
                    <Button
                      plain
                      disabled={currentBlogPage >= blogPageCount - 1}
                      onClick={() =>
                        setCurrentBlogPage((page) => Math.min(blogPageCount - 1, page + 1))
                      }
                      icon={
                        <Box
                          width="56px"
                          height="56px"
                          round="full"
                          align="center"
                          justify="center"
                          background={currentBlogPage >= blogPageCount - 1 ? '#d6dce6' : '#4e5668'}
                        >
                          <FormNextLink color="#ffffff" size="medium" />
                        </Box>
                      }
                    />
                  </Box>
                )}
              </Box> 
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
      layoutClassName="platform-layout"
      title={siteTitle}
      sectionTitle="Getting started"
      sidebarContent={
        sidebarItems.length > 0
          ? renderMenu(sidebarItems, activeSidebarHref, handleSidebarLinkClick)
          : null
      }
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
