import styled from 'styled-components';

export const CARD_WIDTH = 384;
export const CARD_GAP = 24;

export const Section = styled.div`
  background: #f7f7f7;
  padding: 96px max(24px, 8.33%, calc((100% - 1600px) / 2));
  overflow-x: hidden;
  overflow-y: visible;

  @media (max-width: 768px) {
    padding: 48px 32px;
  }
`;

export const CarouselViewport = styled.div`
  overflow-x: hidden;
  overflow-y: visible;
  width: 100%;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
`;

export const OsCard = styled.div`
  flex: 0 0 ${CARD_WIDTH}px;
  width: ${CARD_WIDTH}px;
  box-sizing: border-box;
  border: 1px solid #b1b9be;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  background: #ffffff;
  text-decoration: none;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const LogoWrapper = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
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
