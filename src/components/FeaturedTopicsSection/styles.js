import styled from 'styled-components';

export const SectionWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 24px;
  margin-top: 24px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 0 24px;
    margin-top: 16px;
    gap: 24px;
  }
`;

export const FeatureCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 40px;
  flex: 1 0 calc(50% - 12px);
  min-width: 0;
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

  @media (max-width: 1024px) {
    flex: none;
    width: 100%;
    min-height: auto;
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

export const CardTitle = styled.h2`
  font-size: 52px;
  font-weight: 500;
  line-height: 58px;
  letter-spacing: -1.04px;
  color: white;
  margin: 0;
  max-width: 100%;

  @media (max-width: 1024px) {
    font-size: 36px;
    line-height: 44px;
    letter-spacing: -0.72px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -0.56px;
  }
`;
