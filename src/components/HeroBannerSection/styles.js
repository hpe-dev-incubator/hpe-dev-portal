import styled, { css } from 'styled-components';
import { Box, Button, Heading, Text } from 'grommet';
import { ButtonLink, ExternalButtonLink } from '../Link';

export const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const SlideTrack = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(calc(-1 * ${({ index }) => index} * 100%));
`;

export const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  min-height: 800px;
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor || '#e4e6ea'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-4xlarge, 144px) max(24px, 8.33%)
    var(--spacing-3xlarge, 96px);

  @media (max-width: 768px) {
    min-height: 720px;
    padding: 144px 32px 96px;
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
  inset: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  ${({ $isDark, $isVideo, bgColor }) => {
    if ($isVideo) {
      if (!$isDark) {
        return css`
          background: linear-gradient(
            90deg,
            ${bgColor || '#f1f2f4'} 20%,
            ${bgColor || '#f1f2f4'}d9 58%,
            transparent 100%
          );
        `;
      }

      return css`
        background: linear-gradient(
          90deg,
          ${bgColor || '#292d3a'} 14%,
          ${bgColor || '#292d3a'}d9 52%,
          transparent 100%
        );
      `;
    }

    if ($isDark) {
      return css`
        background: linear-gradient(
          90deg,
          ${bgColor || '#292d3a'} 10%,
          ${bgColor || '#292d3a'}bf 48%,
          transparent 100%
        );
      `;
    }

    return css`
      background: linear-gradient(
        90deg,
        ${bgColor || '#ececec'} 26%,
        ${bgColor || '#ececec'}d9 54%,
        transparent 100%
      );
    `;
  }}
`;

export const SlideContent = styled(Box)`
  position: relative;
  z-index: 2;
  max-width: 568px;
  padding-top: var(--spacing-2xlarge, 72px);

  @media (max-width: 768px) {
    max-width: 100%;
    padding-top: 72px;
  }
`;

export const SlideTitle = styled(Heading)`
  margin: 0;
  font-size: 72px;
  font-family: 'HPE Graphik', 'Metric', Arial, sans-serif;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -1.04px;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};

  @media (max-width: 480px) {
    font-size: 44px;
  }
`;

export const SlideSubtitle = styled(Text)`
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
  letter-spacing: -0.2px;
  color: ${({ $isDark }) =>
    $isDark ? 'rgba(255,255,255,0.72)' : 'rgba(62,69,80,0.72)'};

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 1.4;
  }
`;

export const CTAButtonLabel = styled(Text)`
  line-height: 24px;
  white-space: nowrap;
`;

export const CTARow = styled(Box)`
  position: relative;
  z-index: 2;
`;

const ctaBase = css`
  min-height: 64px;
  border-radius: 9999px;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s,
    opacity 0.2s;

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`;

export const PrimaryBtn = styled(ButtonLink)`
  ${ctaBase}
  background: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};
  color: ${({ $isDark }) => ($isDark ? '#292d3a' : '#ffffff')};

  &:hover {
    color: ${({ $isDark }) => ($isDark ? '#292d3a' : '#ffffff')};
  }
`;

export const GhostBtn = styled(ButtonLink)`
  ${ctaBase}
  min-height: 24px;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};

  &:hover {
    background: ${({ $isDark }) =>
      $isDark ? 'rgba(255,255,255,0.08)' : 'rgba(41,45,58,0.06)'};
    color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};
  }
`;

export const GhostExternalBtn = styled(ExternalButtonLink)`
  ${ctaBase}
  min-height: 24px;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};

  &:hover {
    background: ${({ $isDark }) =>
      $isDark ? 'rgba(255,255,255,0.08)' : 'rgba(41,45,58,0.06)'};
    color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#292d3a')};
  }
`;

export const HeroControls = styled(Box)`
  position: relative;
  z-index: 2;
`;

export const NavBtnRow = styled(Box)`
  position: relative;
  z-index: 2;
`;

export const NavBtn = styled(Button)`
  width: 56px;
  height: 56px;
  border-radius: 1000px;
  border: none;
  min-width: 56px;
  min-height: 56px;
  padding: 20px 0;
  background: ${({ $isPrimary, $isDark }) => {
    if ($isPrimary) return '#292d3a';
    return $isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.04)';
  }};
  color: ${({ $isPrimary, $isDark }) => {
    if ($isPrimary) return '#ffffff';
    return $isDark ? 'rgba(255,255,255,0.8)' : '#292d3a';
  }};

  &:hover:not([disabled]) {
    opacity: 0.86;
  }

  &:disabled {
    opacity: 0.35;
  }

  && > span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  && svg {
    display: block;
    margin: auto;
  }
`;

export const SlideCounter = styled(Text)`
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.2px;
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.6)' : '#606a70')};
`;
