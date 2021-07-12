import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Box, Button } from 'grommet';
import { FormDown } from 'grommet-icons';
import { BlogCard } from '../BlogCard';
import ResponsiveGrid from '../ResponsiveGrid';

const OpenSourceTab = ({
  initialPage,
  // location,
  columns,
}) => {
  console.log('initialPage: ', initialPage);
  const [latestPage, setLatestPage] = useState(initialPage);
  const [blogPosts, setBlogPosts] = useState(initialPage.nodes);
  const [collectionId, setCollectionId] = useState(initialPage.collection.id);
  useEffect(() => {
    setCollectionId(initialPage.collection.id);

    //   const blogLocalStorage = JSON.parse(localStorage.getItem('blogData'));

    //   if (
    //     blogLocalStorage &&
    //     blogLocalStorage.latestPage &&
    //     blogLocalStorage.latestBlogPosts
    //   ) {
    //     setLatestPage(blogLocalStorage.latestPage);
    //     setBlogPosts(blogLocalStorage.latestBlogPosts);
    //   }

    //   if (location.state && location.state.isBlogHeaderClicked) {
    //     navigate('/blog', { replace: true });
    //     setLatestPage(initialPage);
    //     setBlogPosts(initialPage.nodes);
    //     localStorage.removeItem('blogPosition');
    //     localStorage.removeItem('blogData');
    //   }
  }, [initialPage]);

  // useEffect(() => {
  //   const scrollPosition = JSON.parse(localStorage.getItem('blogPosition'));

  //   if (scrollPosition) {
  //     setTimeout(() => {
  //       window.scrollTo({
  // top: scrollPosition,
  // left: 0,
  // behavior: 'smooth' });
  //     }, 100);
  //   }
  // }, []);

  const loadNextPage = useCallback(async () => {
    if (!latestPage.hasNextPage) return;
    const nextPageId = latestPage.nextPage.id;
    console.log('collectionId: ', collectionId);
    console.log('nextPageId: ', nextPageId);
    const path = withPrefix(
      `/paginated-data/${collectionId}/${nextPageId}.json`,
    );
    console.log('path: ', path);
    const res = await fetch(path);
    console.log('res: ', res);
    const json = await res.json();
    console.log('json: ', json);
    setBlogPosts((state) => [...state, ...json.nodes]);
    setLatestPage(json);

    // localStorage.setItem(
    //   'blogData',
    //   JSON.stringify({
    //     latestBlogPosts: [...blogPosts, ...json.nodes],
    //     latestPage: json,
    //   }),
    // );
  }, [latestPage, collectionId]);

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
  // location: PropTypes.objectOf(PropTypes.string),
};

export default OpenSourceTab;
