import styled from 'styled-components';

export const CARD_WIDTH = 400;
export const CARD_GAP = 24;

export const Section = styled.section`
  background: #ffffff;
  padding: 96px max(24px, 8.33%);
  overflow: hidden;
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

export const ViewAllLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: #292d3a;
  text-decoration: none;
  letter-spacing: -0.2px;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: #292d3a;
  }
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

export const EventCard = styled.div`
  flex: 0 0 ${CARD_WIDTH}px;
  width: ${CARD_WIDTH}px;
  background: #f7f7f7;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 8px 32px rgba(41, 45, 58, 0.12);
  }
`;

export const EventImageWrapper = styled.div`
  height: 200px;
  background: #e4e6ea;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const EventBody = styled.div`
  padding: 28px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

export const EventDate = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #01a982;
`;

export const EventCategory = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  background: #e8edf8;
  color: #1a3a7a;
  align-self: flex-start;
`;

export const EventTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.3px;
  color: #292d3a;
`;

export const EventLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #292d3a;
  text-decoration: none;
  margin-top: auto;
  padding-top: 8px;

  &:hover {
    text-decoration: underline;
    color: #292d3a;
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
