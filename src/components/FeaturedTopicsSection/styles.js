import styled from 'styled-components';

export const SectionWrapper = styled.section`
  width: 100%;
  display: flex;
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
  justify-content: flex-end;
  flex: 1 0 0;
  min-width: 0;
  min-height: 340px;
  padding: 48px max(32px, 6%);
  overflow: hidden;
  text-decoration: none;
  background-color: ${({ bgColor }) => bgColor || '#e4e6ea'};
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ overlay }) => overlay || 'transparent'};
    z-index: 0;
  }

  @media (max-width: 768px) {
    min-height: 280px;
    padding: 40px 24px;
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

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 480px;
`;

export const CardTitle = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${({ isDark }) => (isDark ? '#ffffff' : '#ffffff')};
  margin: 0 0 12px;
`;

export const CardDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ isDark }) =>
    isDark ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.85)'};
  margin: 0 0 28px;
  max-width: 400px;
`;

export const CardCTA = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 2px;
  transition: border-color 0.2s;

  ${FeatureCard}:hover & {
    border-color: #ffffff;
  }
`;
