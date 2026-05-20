import styled from 'styled-components';

export const CARD_WIDTH = 360;
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
`;

export const CardImageWrapper = styled.div`
  position: relative;
  height: 200px;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  background: rgba(0, 0, 0, 0.04);

  &:not(:disabled):hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const NextButton = styled(NavButton)`
  background: #292d3a;

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
