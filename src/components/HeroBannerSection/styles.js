import styled, { css } from 'styled-components';

export const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const SlideTrack = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(calc(-1 * ${({ index }) => index} * 100vw));
`;

export const Slide = styled.div`
  position: relative;
  flex: 0 0 100vw;
  min-height: 560px;
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor || '#e4e6ea'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px max(24px, 8.33%) 120px;

  @media (max-width: 768px) {
    padding: 64px 24px 100px;
    min-height: 480px;
  }
`;

// Right-side image for light slides; full-bleed for dark slides
export const SlideBgImage = styled.img`
  position: absolute;
  top: 0;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;

  ${({ isDark }) =>
    isDark
      ? css`
          left: 0;
          width: 100%;
          object-fit: cover;
          opacity: 0.35;
        `
      : css`
          right: 0;
          width: 62%;
          object-fit: cover;
          object-position: center;
        `}
`;

// Full-bleed video background for video slides
// Use $opacity (transient prop) to control video dimming without DOM warning
export const SlideBgVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  opacity: ${({ $opacity }) => $opacity ?? 1};
`;

// Gradient that blends the image/video into the slide background colour
export const SlideBgOverlay = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  ${({ isDark, isVideo, bgColor }) => {
    // Video slides: full-width left-to-right fade from bgColor to transparent
    // Matches Figma node 1010:911 gradient fill (position 0→1, horizontal)
    if (isVideo) {
      return css`
        left: 0;
        width: 100%;
        background: linear-gradient(
          to right,
          ${bgColor || '#d4d4d4'}cc 0%,
          ${bgColor || '#d4d4d4'}80 40%,
          ${bgColor || '#d4d4d4'}33 75%,
          transparent 100%
        );
      `;
    }
    // Dark image slides: left-anchored scrim so text is readable
    if (isDark) {
      return css`
        left: 0;
        width: 100%;
        background: linear-gradient(
          to right,
          ${bgColor || '#151e2b'} 0%,
          ${bgColor || '#151e2b'}cc 30%,
          transparent 65%
        );
      `;
    }
    // Light image slides: right-side image blends into bg
    return css`
      right: 0;
      width: 62%;
      background: linear-gradient(
        to right,
        ${bgColor || '#e4e6ea'} 0%,
        transparent 38%
      );
    `;
  }}
`;

export const SlideContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SlideTitle = styled.h2`
  margin: 0;
  font-size: clamp(36px, 4.5vw, 72px);
  font-family: 'Source Sans Pro', 'Metric', 'HPE_Graphik', sans-serif;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -1.04px;
  color: ${({ isDark }) => (isDark ? '#ffffff' : '#292d3a')};
`;

export const SlideSubtitle = styled.p`
  margin: 0;
  font-size: clamp(16px, 1.5vw, 24px);
  line-height: 1.5;
  letter-spacing: -0.2px;
  color: ${({ isDark }) =>
    isDark ? 'rgba(255,255,255,0.7)' : 'rgba(62,69,80,0.7)'};
`;

export const CTARow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`;

const btnBase = css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 16px 28px;
  border-radius: 9999px;
  text-decoration: none;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
    text-decoration: none;
  }

  svg {
    flex-shrink: 0;
  }
`;

export const PrimaryBtn = styled.a`
  ${btnBase}
  background: ${({ isDark }) => (isDark ? '#ffffff' : '#292d3a')};
  color: ${({ isDark }) => (isDark ? '#292d3a' : '#ffffff')};

  &:hover {
    color: ${({ isDark }) => (isDark ? '#292d3a' : '#ffffff')};
  }
`;

export const GhostBtn = styled.a`
  ${btnBase}
  background: transparent;
  color: ${({ isDark }) => (isDark ? '#ffffff' : '#292d3a')};

  &:hover {
    background: ${({ isDark }) =>
      isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,58,0.07)'};
    color: ${({ isDark }) => (isDark ? '#ffffff' : '#292d3a')};
  }
`;

// Controls are absolutely positioned at the bottom-left of the hero wrapper
export const HeroControls = styled.div`
  position: absolute;
  bottom: 52px;
  left: max(24px, 8.33%);
  display: flex;
  align-items: center;
  gap: 40px;
  z-index: 10;

  @media (max-width: 768px) {
    bottom: 28px;
    left: 24px;
    gap: 24px;
  }
`;

export const NavBtnRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const NavBtn = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    opacity 0.2s;
  background: ${({ isPrimary, isDark }) => {
    if (isPrimary) return '#292d3a';
    return isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)';
  }};
  color: ${({ isPrimary, isDark }) => {
    if (isPrimary) return '#ffffff';
    return isDark ? 'rgba(255,255,255,0.8)' : '#292d3a';
  }};

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export const SlideCounter = styled.span`
  font-size: 18px;
  line-height: 1.5;
  letter-spacing: -0.2px;
  color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.5)' : '#606a70')};
`;
