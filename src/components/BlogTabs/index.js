import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'grommet';
import { FormDown } from 'grommet-icons';
import styled from 'styled-components';
import BlogTabContent from '../BlogTabContent';
import { FONT } from '../BlogListCard';

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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

function BlogTabs({ data }) {
  const [index, setIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');

  const tabs = [
    {
      key: 'all',
      label: 'All',
      count: data.allBlogsCount?.totalCount,
      page: data.allBlogs,
    },
    {
      key: 'greenlake',
      label: 'HPE GreenLake',
      count: data.greenlakeBlogsCount?.totalCount,
      page: data.greenlakeBlogs,
    },
    {
      key: 'opensource',
      label: 'Open Source',
      count: data.openSourceBlogsCount?.totalCount,
      page: data.openSourceBlogs,
    },
    {
      key: 'featured',
      label: 'Featured',
      count: data.featuredBlogsCount?.totalCount,
      page: data.featuredBlogs,
    },
    {
      key: 'others',
      label: 'Others',
      count: data.othersBlogsCount?.totalCount,
      page: data.othersBlogs,
    },
  ].filter((tab) => tab.page && tab.page.nodes?.length > 0);

  useEffect(() => {
    // restores the tab when the user goes back to the blog page
    const stored = Number(window.localStorage.getItem('activeBlogTab'));
    if (Number.isInteger(stored) && stored > 0) setIndex(stored);
    const tab = new URLSearchParams(window.location.search).get('activeTab');
    if (tab !== null && Number.isInteger(+tab)) setIndex(+tab);
  }, []);

  const activeIndex = index < tabs.length ? index : 0;
  const activeTab = tabs[activeIndex];
  const activeSort = SORT_OPTIONS.find((o) => o.value === sortOrder);

  return (
    <>
      <FilterBar role="tablist" aria-label="Blog categories">
        {tabs.map((tab, i) => (
          <Pill
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            $active={i === activeIndex}
            onClick={() => setIndex(i)}
          >
            {tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label}
          </Pill>
        ))}
        <SortWrapper>
          <Menu
            a11yTitle="Sort blogs"
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
      {activeTab && (
        <BlogTabContent
          key={activeTab.key}
          initialPage={activeTab.page}
          activeTab={activeIndex}
          sortOrder={sortOrder}
        />
      )}
    </>
  );
}

const blogsPropType = PropTypes.shape({
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  hasNextPage: PropTypes.bool,
  nextPage: PropTypes.shape({
    id: PropTypes.string,
  }),
  collection: PropTypes.shape({
    id: PropTypes.string,
  }),
});

const countPropType = PropTypes.shape({ totalCount: PropTypes.number });

BlogTabs.propTypes = {
  data: PropTypes.shape({
    allBlogs: blogsPropType,
    greenlakeBlogs: blogsPropType,
    openSourceBlogs: blogsPropType,
    featuredBlogs: blogsPropType,
    othersBlogs: blogsPropType,
    allBlogsCount: countPropType,
    greenlakeBlogsCount: countPropType,
    openSourceBlogsCount: countPropType,
    featuredBlogsCount: countPropType,
    othersBlogsCount: countPropType,
  }).isRequired,
};

export default BlogTabs;
