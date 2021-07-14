import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Box, Button } from 'grommet';
import { FormDown } from 'grommet-icons';
import { BlogCard } from '../BlogCard';
import ResponsiveGrid from '../ResponsiveGrid';

const OpenSourceTab = ({
  initialPage,
  location,
  columns,
  activeTab,
  platform,
}) => {
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage.nodes);
  const [collectionId, setCollectionId] = useState(initialPage.collection.id);

  useEffect(() => {
    setCollectionId(initialPage.collection.id);

    // persist active tab for when user goes back to blog page
    localStorage.setItem('blogTab', JSON.stringify(activeTab));

    // platform tab needs to be opened for when user goes back
    // to blog page platform tab
    if (platform) {
      localStorage.setItem('openDropButton', JSON.stringify(true));
    } else {
      localStorage.setItem('openDropButton', JSON.stringify(false));
    }

    // loads blogs from user clicks 'Load More'
    // for when user goes back to blog page
    const blogData = JSON.parse(localStorage.getItem('blogData'));

    if (
      blogData &&
      blogData.latestPage &&
      blogData.latestBlogPosts &&
      blogData.collectionId === collectionId
    ) {
      setLatestPage(blogData.latestPage);
      setBlogPosts(blogData.latestBlogPosts);
    }
  }, [initialPage, location, activeTab, platform, collectionId]);

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

    localStorage.setItem(
      'blogData',
      JSON.stringify({
        latestBlogPosts: [...blogPosts, ...json.nodes],
        latestPage: json,
        collectionId,
      }),
    );
  }, [latestPage, collectionId, blogPosts]);

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

OpenSourceTab.propTypes = {
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
  location: PropTypes.objectOf(PropTypes.string),
  activeTab: PropTypes.number,
  platform: PropTypes.bool,
};

export default OpenSourceTab;
