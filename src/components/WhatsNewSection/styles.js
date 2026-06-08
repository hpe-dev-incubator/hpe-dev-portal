import styled from 'styled-components';

export const CARD_WIDTH = 370;
export const CARD_GAP = 40;

export const Section = styled.section`
  background: #f7f7f7;
  padding: 96px max(24px, 8.33%, calc((100% - 1600px) / 2));
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 48px 32px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 48px;
  font-weight: 500;
  line-height: 58px;
  letter-spacing: -1.04px;
  color: #292d3a;
`;

export const CarouselViewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

export const NewCard = styled.div`
  flex: 0 0 ${({ $width }) => $width || CARD_WIDTH}px;
  width: ${({ $width }) => $width || CARD_WIDTH}px;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
`;

export const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #e0e2e6;
  flex-shrink: 0;
  position: relative;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
`;

export const TypeBadge = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
  color: #3e4550;
  align-self: flex-start;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  line-height: 34px;
  letter-spacing: -0.28px;
  color: #292d3a;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: #3e4550;
`;

export const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #01a982;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #01a982;
  }

  svg {
    flex-shrink: 0;
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 48px;
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
    background 0.15s,
    opacity 0.15s;
  background: ${({ isPrimary }) =>
    isPrimary ? '#292d3a' : 'rgba(0,0,0,0.06)'};
  color: ${({ isPrimary }) => (isPrimary ? '#ffffff' : '#292d3a')};

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
  color: #606a70;

  @media (max-width: 768px) {
    display: none;
  }
`;
