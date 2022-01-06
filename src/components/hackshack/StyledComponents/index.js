import styled, { keyframes } from 'styled-components';
import { Box } from 'grommet';

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateX(10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const MainTitle = styled(Box)`
  opacity: 0;
  animation: ${slideUp} 0.8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
`;
