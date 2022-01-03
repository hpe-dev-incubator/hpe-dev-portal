import styled, { keyframes } from 'styled-components';
import { Box, Grid } from 'grommet';

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const CardWrapper = styled(Box)`
  opacity: 0;
  animation: ${slideIn} 0.8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
  max-width: 576px;
  width: 100%;
  @media (min-width: 900px) {
    min-width: 366px;
  }
`;

const StyledGrid = styled(Grid)`
  grid: auto / auto;
  @media (min-width: 1300px) {
    grid: auto / auto auto;
  }
  @media (min-width: 2000px) {
    grid: auto / auto auto auto;
  }
  @media (min-width: 2500px) {
    grid: auto / auto auto auto auto;
  }
`;

export { CardWrapper, StyledGrid };
