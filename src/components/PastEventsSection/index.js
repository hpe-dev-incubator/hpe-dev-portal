import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'grommet';
import { FormDown } from 'grommet-icons';
import styled from 'styled-components';
import EventListCard, { FONT } from '../EventListCard';

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
`;

const Pill = styled.button`
  border: none;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 100px;
  font-family: ${FONT};
  font-size: 16px;
  line-height: normal;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? '#ffffff' : '#67686e')};
  background: ${({ $active }) => ($active ? '#292d3a' : 'transparent')};

  &:not([aria-selected='true']):hover {
    background: rgba(41, 45, 58, 0.07);
  }

  &:focus-visible {
    outline: 2px solid #01a982;
    outline-offset: 2px;
  }
`;

const SortWrapper = styled.div`
  margin-left: auto;
`;

const SortControl = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 12px 24px;
  background: #ffffff;
  border: 1px solid #b1b9be;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 16px;
  line-height: normal;
  color: #292d3a;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
`;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

// Preferred display order for known categories; any category not listed
// here (e.g. a future new one) is appended after, sorted by frequency.
const CATEGORY_ORDER = [
  'HPE AI Developer Day',
  'AI Jam Session',
  'Meetup',
  'Munch & Learn',
  'Event',
];

// Past events are already loaded in full (no pagination needed at this
// volume), so filtering, sorting and the grid all happen client-side.
const PastEventsSection = ({ events }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = useMemo(() => {
    const counts = new Map();
    events.forEach(({ node }) => {
      const { category } = node.frontmatter;
      if (!category) return;
      counts.set(category, (counts.get(category) || 0) + 1);
    });
    return [...counts.entries()].sort(([aCategory, aCount], [bCategory, bCount]) => {
      const aIndex = CATEGORY_ORDER.indexOf(aCategory);
      const bIndex = CATEGORY_ORDER.indexOf(bCategory);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return bCount - aCount;
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    const list =
      activeCategory === 'All'
        ? events
        : events.filter(
            ({ node }) => node.frontmatter.category === activeCategory,
          );
    return sortOrder === 'oldest' ? [...list].reverse() : list;
  }, [events, activeCategory, sortOrder]);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortOrder);

  if (!events || events.length === 0) return null;

  return (
    <section aria-labelledby="past-events-title">
      <h2
        id="past-events-title"
        style={{
          margin: '0 0 40px',
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: '-0.5px',
          color: '#292d3a',
        }}
      >
        Past Events
      </h2>
      <FilterBar role="tablist" aria-label="Event categories">
        <Pill
          type="button"
          role="tab"
          aria-selected={activeCategory === 'All'}
          $active={activeCategory === 'All'}
          onClick={() => setActiveCategory('All')}
        >
          {`All (${events.length})`}
        </Pill>
        {categories.map(([category, count]) => (
          <Pill
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            $active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {`${category} (${count})`}
          </Pill>
        ))}
        <SortWrapper>
          <Menu
            a11yTitle="Sort events"
            dropProps={{ align: { top: 'bottom', right: 'right' } }}
            items={SORT_OPTIONS.map((option) => ({
              label: option.label,
              onClick: () => setSortOrder(option.value),
            }))}
            plain
          >
            <SortControl>
              {activeSort.label}
              <FormDown size="small" />
            </SortControl>
          </Menu>
        </SortWrapper>
      </FilterBar>
      <Grid>
        {filteredEvents.map(({ node }) => (
          <EventListCard key={node.id} node={node} />
        ))}
      </Grid>
    </section>
  );
};

PastEventsSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        frontmatter: PropTypes.shape({
          title: PropTypes.string,
          category: PropTypes.string,
          dateStart: PropTypes.string,
          dateEnd: PropTypes.string,
          link: PropTypes.string,
        }).isRequired,
        fields: PropTypes.shape({
          slug: PropTypes.string,
          sourceInstanceName: PropTypes.string,
        }),
      }).isRequired,
    }),
  ).isRequired,
};

export default PastEventsSection;
