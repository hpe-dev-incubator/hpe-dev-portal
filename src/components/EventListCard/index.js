import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';
import { CirclePlay, LinkNext } from 'grommet-icons';

export const FONT = "'HPE Graphik', 'Metric', Arial, sans-serif";

const monthDay = Intl.DateTimeFormat('default', {
  month: 'long',
  day: 'numeric',
});
const day = Intl.DateTimeFormat('default', { day: 'numeric' });
const year = Intl.DateTimeFormat('default', { year: 'numeric' });

// Formats a single date, or a "Month Day - Day, Year" range when the event
// spans multiple days.
export const formatEventDate = (dateStart, dateEnd) => {
  if (!dateStart) return '';
  const start = new Date(dateStart);
  const end = dateEnd ? new Date(dateEnd) : start;
  const base = monthDay.format(start);
  const multiDay = day.format(end) > day.format(start);
  return `${base}${multiDay ? ` - ${day.format(end)}` : ''}, ${year.format(end)}`;
};

// A few event bodies start with a standalone date line (e.g. "09/30/2026")
// that duplicates the dedicated date field shown next to it; strip it so
// the excerpt starts with the actual description.
const LEADING_DATE_LINE = /^\s*\d{1,2}\/\d{1,2}\/\d{4}\s*/;

export const cleanEventExcerpt = (excerpt) =>
  excerpt ? excerpt.replace(LEADING_DATE_LINE, '') : excerpt;

// Events use frontmatter.link as their primary destination (often an
// external registration/recording URL), falling back to the event's own
// detail page.
export const getEventLink = (node) => {
  const link = node?.frontmatter?.link;
  if (link) {
    return { href: link, external: /^https?:\/\//i.test(link) };
  }
  const slug = node?.fields?.slug;
  const source = node?.fields?.sourceInstanceName;
  if (slug && source) return { href: `/${source}${slug}`, external: false };
  return { href: null, external: false };
};

// Past events most often link out to a recorded video (YouTube, Vimeo)
// rather than a generic page; surface those as a "Watch replay" CTA
// instead of the default "Learn more".
const VIDEO_LINK_PATTERN = /(?:youtube\.com|youtu\.be|vimeo\.com)/i;

export const isVideoLink = (url) => !!url && VIDEO_LINK_PATTERN.test(url);

export const EventCategory = styled.div`
  font-family: ${FONT};
  font-size: 16px;
  line-height: 24px;
  color: #67686e;
`;

export const EventDate = styled.div`
  font-family: ${FONT};
  font-size: 16px;
  line-height: 24px;
  color: #67686e;
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

  &:hover h3,
  &:focus-visible h3 {
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

  h3 {
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

const EventListCard = ({ node }) => {
  const { href, external } = getEventLink(node);
  const { title, category, dateStart, dateEnd } = node.frontmatter;
  if (!href) return null;

  const isReplay = isVideoLink(href);

  const content = (
    <>
      <CardText>
        {category && <EventCategory>{category}</EventCategory>}
        <h3>{title}</h3>
        {dateStart && <EventDate>{formatEventDate(dateStart, dateEnd)}</EventDate>}
      </CardText>
      <ReadMore>
        {isReplay ? 'Watch replay' : 'Learn more'}
        {isReplay ? (
          <CirclePlay size="small" color="#006750" />
        ) : (
          <LinkNext size="small" color="#006750" />
        )}
      </ReadMore>
    </>
  );

  return external ? (
    <Card as="a" href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </Card>
  ) : (
    <Card to={href}>{content}</Card>
  );
};

EventListCard.propTypes = {
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      dateStart: PropTypes.string,
      dateEnd: PropTypes.string,
      link: PropTypes.string,
    }),
    fields: PropTypes.shape({
      slug: PropTypes.string,
      sourceInstanceName: PropTypes.string,
    }),
  }).isRequired,
};

export default EventListCard;
