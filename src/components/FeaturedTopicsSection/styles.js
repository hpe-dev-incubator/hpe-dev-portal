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
    padding: 0 16px;
    margin-top: 16px;
    gap: 16px;
  }
`;

export const FeatureCard = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 calc(50% - 36px);
  min-width: 0;
  min-height: 480px;
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
    padding: 64px 48px;
  }

  @media (max-width: 768px) {
    flex: 1 0 100%;
    min-height: 360px;
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

export const CardIcon = styled.img`
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
  border-radius: 16px;
`;

export const CardEyebrow = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const CardTitle = styled.h2`
  font-size: clamp(32px, 3.2vw, 52px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -1.04px;
  color: #ffffff;
  margin: 0 0 16px;
`;

export const CardDescription = styled.p`
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: -0.2px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const CardCTA = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 20px 36px;
  border-radius: 9999px;
  background: #ffffff;
  color: #292d3a;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.2s;

  ${FeatureCard}:hover & {
    opacity: 0.88;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    min-height: 52px;
    padding: 14px 28px;
  }
`;
