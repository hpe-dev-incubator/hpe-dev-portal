import styled from 'styled-components';

export const CARD_WIDTH = 436;
export const CARD_GAP = 40;

export const Section = styled.div`
  background: #ffffff;
  padding: 96px max(24px, 8.33%);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 48px 32px;
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
  overflow: hidden;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;

export const CardImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #d5d5d5;
  flex-shrink: 0;
`;

export const CardImageGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(247, 247, 247, 0), #f7f7f7);
  pointer-events: none;
`;

export const CardBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
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
    background: #9aa5ab;
  }
`;

export const NextButton = styled(NavButton)`
  background: #535c66;

  &:not(:disabled):hover {
    background: #3d4254;
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
