import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Box, Button } from 'grommet';
import { FormDown } from 'grommet-icons';
import styled from 'styled-components';
import BlogListCard from '../BlogListCard';
import { useLocalStorage } from '../../hooks/use-local-storage';

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

const BlogTabContent = ({ initialPage, activeTab, sortOrder }) => {
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage?.nodes || []);
  const collectionId = initialPage?.collection?.id;
  const isLoadingAll = useRef(false);
  /* eslint-disable no-unused-vars */
  const [activeBlogTab, setActiveBlogTab] = useLocalStorage('activeBlogTab');
  /* eslint-enable no-unused-vars */
  const [loadMoreBlogData, setLoadMoreBlogData] =
    useLocalStorage('loadMoreBlogData');

  useEffect(() => {
    setActiveBlogTab(activeTab);

    // loads persisted data if the load more btn was
    // clicked when the user goes back to blog page
    if (
      // clear localStorage if new blog post has been published
      loadMoreBlogData &&
      loadMoreBlogData.latestBlogPosts?.[0]?.id !== blogPosts[0]?.id
    ) {
      localStorage.removeItem('loadMoreBlogData');
    } else if (
      loadMoreBlogData &&
      loadMoreBlogData.latestPage &&
      loadMoreBlogData.latestBlogPosts &&
      loadMoreBlogData.collectionId === collectionId
    ) {
      setLatestPage(loadMoreBlogData.latestPage);
      setBlogPosts(loadMoreBlogData.latestBlogPosts);
    }
  }, [activeTab, blogPosts, collectionId, loadMoreBlogData, setActiveBlogTab]);

  const fetchPage = useCallback(
    async (pageId) => {
      const path = withPrefix(`/paginated-data/${collectionId}/${pageId}.json`);
      const res = await fetch(path);
      return res.json();
    },
    [collectionId],
  );

  const loadNextPage = useCallback(async () => {
    if (!latestPage.hasNextPage) return;
    const json = await fetchPage(latestPage.nextPage.id);
    setBlogPosts((state) => [...state, ...json.nodes]);
    setLatestPage(json);

    setLoadMoreBlogData({
      latestBlogPosts: [...blogPosts, ...json.nodes],
      latestPage: json,
      collectionId,
    });
  }, [latestPage, collectionId, blogPosts, fetchPage, setLoadMoreBlogData]);

  // Pages are date-descending, so an oldest-first view needs every page.
  const loadAllPages = useCallback(async () => {
    if (isLoadingAll.current) return;
    isLoadingAll.current = true;
    try {
      let page = latestPage;
      let posts = blogPosts;
      while (page.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        const json = await fetchPage(page.nextPage.id);
        posts = [...posts, ...json.nodes];
        page = json;
      }
      setBlogPosts(posts);
      setLatestPage(page);
      setLoadMoreBlogData({
        latestBlogPosts: posts,
        latestPage: page,
        collectionId,
      });
    } finally {
      isLoadingAll.current = false;
    }
  }, [latestPage, blogPosts, collectionId, fetchPage, setLoadMoreBlogData]);

  useEffect(() => {
    if (sortOrder === 'oldest' && latestPage?.hasNextPage) loadAllPages();
  }, [sortOrder, latestPage, loadAllPages]);

  const sortedPosts = useMemo(
    () => (sortOrder === 'oldest' ? [...blogPosts].reverse() : blogPosts),
    [blogPosts, sortOrder],
  );

  return (
    <>
      <Grid>
        {sortedPosts.map(
          (blogPost) =>
            blogPost.url !== '/' && (
              <BlogListCard key={blogPost.id} node={blogPost} />
            ),
        )}
      </Grid>
      {latestPage?.hasNextPage && sortOrder !== 'oldest' && (
        <Box align="center" pad="medium">
          <Button
            icon={<FormDown />}
            hoverIndicator
            reverse
            onClick={loadNextPage}
            label="Load More"
          />
        </Box>
      )}
    </>
  );
};

BlogTabContent.propTypes = {
  initialPage: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    nextPage: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    collection: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  activeTab: PropTypes.number,
  sortOrder: PropTypes.oneOf(['newest', 'oldest']),
};

BlogTabContent.defaultProps = {
  activeTab: 0,
  sortOrder: 'newest',
};

export default BlogTabContent;
