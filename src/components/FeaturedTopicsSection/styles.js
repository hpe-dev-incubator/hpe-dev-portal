import styled from 'styled-components';

export const SectionWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 24px;
  margin-top: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 24px;
    margin-top: 16px;
    gap: 24px;
  }
`;

export const FeatureCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 calc(50% - 12px);
  min-width: 0;
  min-height: 630px;
  padding: 96px;
  overflow: hidden;
  text-decoration: none;
  background-color: ${({ bgColor }) => bgColor || '#0a1628'};
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ overlay }) => overlay || 'transparent'};
    z-index: 0;
  }

  @media (max-width: 1200px) {
    min-height: 560px;
    padding: 64px 48px;
  }

  @media (max-width: 768px) {
    flex: 1 0 100%;
    min-height: 480px;
    padding: 48px 24px;
  }
`;

export const CardBgImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
`;
