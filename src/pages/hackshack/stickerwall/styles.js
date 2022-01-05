import styled from 'styled-components';

export const StyledSmallAnchor = styled.a`
  max-width: 180px;
  min-width: 180px;
  max-height: 180px;
  min-height: 180px;

  @media (max-width: 1375px) {
    max-width: 120px;
    min-width: 120px;
    max-height: 100px;
  }

  @media (max-width: 900px) {
    max-width: 100px;
    min-width: 100px;
    max-height: 100px;
    min-height: 100px;
    margin-bottom: 6px;
  }

  @media (max-width: 520px) {
    max-width: 80px;
    min-width: 80px;
    max-height: 80px;
    min-height: 80px;
    margin-bottom: 6px;
  }
`;

export const StyledLargeAnchor = styled.a`
  max-width: 360px;
  min-width: 360px;
  max-height: 180px;
  min-height: 180px;

  @media (max-width: 1375px) {
    max-width: 240px;
    min-width: 240px;
    max-height: 100px;
    min-height: 120px;
  }

  @media (max-width: 900px) {
    max-width: 200px;
    min-width: 200px;
    max-height: 100px;
    min-height: 100px;
    margin-bottom: 6px;
  }

  @media (max-width: 520px) {
    max-width: 160px;
    min-width: 160px;
    max-height: 80px;
    min-height: 80px;
    margin-bottom: 6px;
  }
`;
