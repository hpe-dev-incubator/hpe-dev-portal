import styled from 'styled-components';

export const CARD_WIDTH = 480;
export const CARD_GAP = 24;

export const Section = styled.div`
  background: transparent;
  padding: 96px max(24px, 8.33%);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 48px 24px;
  }
`;

export const CarouselViewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
`;

export const StoryCard = styled.div`
  flex: 0 0 ${CARD_WIDTH}px;
  border-radius: 24px;
  overflow: hidden;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  position: relative;
`;

/* Full-card absolute background layers (image + gradient) */
export const CardBgLayers = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
`;

/* Gradient fades image into white over the lower portion of the card */
export const CardGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(247, 247, 247, 0) 30%, #ffffff 72%);
`;

/* Creates the visible image-only zone above the text content */
export const CardImageSpacer = styled.div`
  height: 300px;
  flex-shrink: 0;
  position: relative;
`;

export const CardBody = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  position: relative;
`;

const NavButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background-color 0.2s,
    opacity 0.2s;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const PrevButton = styled(NavButton)`
  background: #b1b9be;

  &:not(:disabled):hover {
    background: #9aa1a7;
  }
`;

export const NextButton = styled(NavButton)`
  background: #535c66;

  &:not(:disabled):hover {
    background: #3f4850;
  }
`;

export const BucketBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(41, 45, 58, 0.07);
  font-size: 12px;
  font-weight: 600;
  color: #292d3a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  align-self: flex-start;
`;

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 8px;
`;

export const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #d5d5d5;
`;

export const AuthorName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #292d3a;
  line-height: 1.3;
`;

export const PostDate = styled.span`
  font-size: 12px;
  color: #606a70;
  letter-spacing: 0.2px;
`;
