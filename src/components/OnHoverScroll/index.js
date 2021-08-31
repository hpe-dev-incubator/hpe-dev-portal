import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';

const ScrollHost = styled(Box)`
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  /* Keeps platform dropdown menu item aligned to the left */
  & > div > a {
    text-align: left;
  }
`;

const ScrollHostContainer = styled(Box)`
  position: relative;
  max-height: 180px;
`;

const ScrollBar = styled(Box)`
  width: 10px;
  height: 100%;
  right: 0;
  top: 0px;
  position: absolute;
  border-radius: 7px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.15);
`;

const ScrollThumb = styled(Box)`
  width: 8px;
  height: 5px;
  margin-left: 1px;
  position: absolute;
  border-radius: 7px;
  opacity: 1;
  top: 0;
  background-color: rgba(0, 0, 0, 0.55);
`;

const SCROLL_BOX_MIN_HEIGHT = 20;

export default function OnHoverScroll({ children, ...restProps }) {
  const [hovering, setHovering] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState();
  const [isDragging, setDragging] = useState(false);

  const handleMouseOver = useCallback(() => {
    return !hovering && setHovering(true);
  }, [hovering]);

  const handleMouseOut = useCallback(() => {
    return !!hovering && setHovering(false);
  }, [hovering]);

  const handleDocumentMouseUp = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging],
  );

  const scrollHostRef = useRef();

  const handleDocumentMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = scrollHostRef.current;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        const deltaY = e.clientY - lastScrollThumbPosition;
        const percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight,
          ),
        );
        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight,
        );
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop],
  );

  const handleScrollThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) {
      return;
    }
    const scrollHostElement = scrollHostRef.current;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, [scrollBoxHeight]);

  useEffect(() => {
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(
      scrollThumbPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT,
    );
    setScrollBoxHeight(scrollThumbHeight);
    scrollHostElement.addEventListener('scroll', handleScroll, true);
    return function cleanup() {
      scrollHostElement.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    document.addEventListener('mouseleave', handleDocumentMouseUp);
    return function cleanup() {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('mouseleave', handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);
  return (
    <ScrollHostContainer
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <ScrollHost ref={scrollHostRef} {...restProps}>
        {children}
      </ScrollHost>
      <ScrollBar style={{ opacity: hovering ? 1 : 0 }}>
        <ScrollThumb
          style={{ height: scrollBoxHeight, top: scrollBoxTop }}
          onMouseDown={handleScrollThumbMouseDown}
        />
      </ScrollBar>
    </ScrollHostContainer>
  );
}

OnHoverScroll.propTypes = {
  children: PropTypes.node,
};
