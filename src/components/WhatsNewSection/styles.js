import styled from 'styled-components';

export const CARD_WIDTH = 384;
export const CARD_GAP = 24;

export const Section = styled.section`
  background: #f7f7f7;
  padding: 96px max(24px, 8.33%);
  overflow: hidden;
  margin-top: 24px;
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
  flex: 0 0 ${CARD_WIDTH}px;
  width: ${CARD_WIDTH}px;
  display: flex;
  flex-direction: column;
  gap: 46px;
  cursor: pointer;

  &:hover .card-title {
    text-decoration: underline;
  }
`;

export const CardImage = styled.div`
  height: 259px;
  width: 100%;
  overflow: hidden;
  background: #e0e2e6;
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  background: ${({ type }) => (type === 'Workshop' ? '#e8f4ee' : '#e8edf8')};
  color: ${({ type }) => (type === 'Workshop' ? '#1a7a45' : '#1a3a7a')};
  align-self: flex-start;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: #292d3a;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  letter-spacing: -0.2px;
  color: rgba(62, 69, 80, 0.7);
`;

export const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #292d3a;
  text-decoration: none;
  letter-spacing: -0.2px;

  &:hover {
    text-decoration: underline;
    color: #292d3a;
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
`;
