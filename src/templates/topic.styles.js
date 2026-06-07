import styled from 'styled-components';

export const HeroBanner = styled.div`
  position: relative;
  background: #1d1f27;
`;

export const HeroBgImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  pointer-events: none;
`;

export const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(41, 45, 58, 0) 0%,
    rgba(41, 45, 58, 0.8) 78.846%
  );
  pointer-events: none;
`;

export const HeroContent = styled.div`
  position: relative;
  padding: 96px max(24px, calc((100% - 1600px) / 2));
  display: flex;
  flex-direction: column;
  gap: 36px;
  justify-content: flex-end;
`;

export const BreadcrumbRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BreadcrumbText = styled.span`
  color: white;
  font-size: 28px;
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

export const HeroBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 72px;
  font-weight: 500;
  letter-spacing: -1.04px;
  line-height: normal;
`;

export const HeroDescription = styled.p`
  margin: 0;
  color: #e6e8e9;
  font-size: 32px;
  line-height: 43px;
  letter-spacing: -0.2px;
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
`;

/* ── Multimedia / VideoCard ──────────────────────────────────────── */

export const VideoCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  &:hover .video-title {
    text-decoration: underline;
  }
`;

export const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoPlayButton = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  ${VideoCardWrapper}:hover & {
    transform: scale(1.08);
  }
`;

export const VideoCardBody = styled.div`
  background: #f7f7f7;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const VideoCardTitle = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  line-height: 34px;
  letter-spacing: -0.28px;
  color: #292d3a;
`;

export const VideoAuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const VideoAuthorAvatar = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: #01a982;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  span {
    color: white;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    user-select: none;
  }
`;

export const VideoAuthorName = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  color: #3e4550;
`;

export const VideoWatchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  color: #01a982;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
