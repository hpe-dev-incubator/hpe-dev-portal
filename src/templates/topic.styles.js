import styled from 'styled-components';

export const HeroBanner = styled.div`
  position: relative;
  background: #1d1f27;
`;

export const HeroBgImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  pointer-events: none;
`;

export const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(41, 45, 58, 0) 0%,
    rgba(41, 45, 58, 0.8) 78.846%
  );
  pointer-events: none;
`;

export const HeroContent = styled.div`
  position: relative;
  padding: 96px max(24px, calc((100% - 1600px) / 2));
  display: flex;
  flex-direction: column;
  gap: 36px;
  justify-content: flex-end;
`;

export const BreadcrumbRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BreadcrumbText = styled.span`
  color: white;
  font-size: 28px;
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

export const HeroBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 72px;
  font-weight: 500;
  letter-spacing: -1.04px;
  line-height: normal;
`;

export const HeroDescription = styled.p`
  margin: 0;
  color: #e6e8e9;
  font-size: 32px;
  line-height: 43px;
  letter-spacing: -0.2px;
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
`;
