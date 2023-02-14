import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Box, Button } from 'grommet';
import { FormDown } from 'grommet-icons';
import { BlogCard } from '../BlogCard';
import ResponsiveGrid from '../ResponsiveGrid';
import { useLocalStorage } from '../../hooks/use-local-storage';

const BlogTabContent = ({
  initialPage,
  columns,
  activeTab,
  platform,
  setPlatform,
  setPreviousTab,
}) => {
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage?.nodes);
  const [collectionId, setCollectionId] = useState(initialPage?.collection?.id);
  /* eslint-disable no-unused-vars */
  const [activeBlogTab, setActiveBlogTab] = useLocalStorage('activeBlogTab');
  const [activePlatform, setActivePlatform] = useLocalStorage('activePlatform');
  /* eslint-disable no-unused-vars */
  const [loadMoreBlogData, setLoadMoreBlogData] = useLocalStorage(
    'loadMoreBlogData',
  );

  useEffect(() => {
    if (!platform) {
      setCollectionId(initialPage.collection.id);
      setPlatform(false);
      setPreviousTab(activeTab);
      setActivePlatform('');
    }

    setActiveBlogTab(activeTab);

    // loads persisted data if the load more btn was
    // clicked when the user goes back to blog page
    if (
      // clear localStorage if new blog post has been published
      loadMoreBlogData &&
      loadMoreBlogData.latestBlogPosts[0].id !== blogPosts[0].id
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
  }, [
    blogPosts,
    platform,
    initialPage,
    setPlatform,
    setPreviousTab,
    setActivePlatform,
    setActiveBlogTab,
    activeTab,
    loadMoreBlogData,
    collectionId,
  ]);

  const loadNextPage = useCallback(async () => {
    if (!latestPage.hasNextPage) return;
    const nextPageId = latestPage.nextPage.id;
    const path = withPrefix(
      `/paginated-data/${collectionId}/${nextPageId}.json`,
    );
    const res = await fetch(path);
    const json = await res.json();
    setBlogPosts((state) => [...state, ...json.nodes]);
    setLatestPage(json);

    setLoadMoreBlogData({
      latestBlogPosts: [...blogPosts, ...json.nodes],
      latestPage: json,
      collectionId,
    });
  }, [latestPage, collectionId, blogPosts, setLoadMoreBlogData]);

  return (
    <>
      <ResponsiveGrid rows={{}} columns={columns}>
        {blogPosts.map(
          (blogPost) =>
            blogPost.url !== '/' && (
              <BlogCard key={blogPost.id} node={blogPost} />
            ),
        )}
      </ResponsiveGrid>
      <Box align="center" pad="medium">
        <Button
          icon={<FormDown />}
          hoverIndicator
          reverse
          onClick={loadNextPage}
          label="Load More"
        />
      </Box>
    </>
  );
};

BlogTabContent.propTypes = {
  initialPage: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          title: PropTypes.string.isRequired,
          author: PropTypes.string.isRequired,
          date: PropTypes.string,
          description: PropTypes.string,
          authorimage: PropTypes.string,
        }),
      }).isRequired,
    ).isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    nextPage: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    collection: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  columns: PropTypes.shape({
    small: PropTypes.string,
    medium: PropTypes.arrayOf(PropTypes.string),
    large: PropTypes.arrayOf(PropTypes.string),
    xlarge: PropTypes.arrayOf(PropTypes.string),
  }),
  activeTab: PropTypes.number,
  platform: PropTypes.bool,
  setPlatform: PropTypes.func,
  setPreviousTab: PropTypes.func,
};

export default BlogTabContent;
