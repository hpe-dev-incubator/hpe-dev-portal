import { Box, Button } from 'grommet';
import styled, { keyframes } from 'styled-components';

const tealSlide = keyframes`
  0% {
    transform: translateX(-5px) translateY(-5px);
  }

  30% {
    transform: translateX(5px) translateY(-5px);
  }

  60% {
    transform: translateX(5px) translateY(5px) scale(1.025);
  }

  100% {
    transform: translateX(1px) translateY(1px) scale(1.025);
  }
`;

const tealSlideReverse = keyframes`
  0% {
  transform: translateX(0) translateY(0);
  }

  30% {
  transform: translateX(4px) translateY(0);
  }

  50% {
  transform: translateX(5px) translateY(-5px);
  }

  100% {
    transform: translateX(-5px) translateY(-5px);
  }
`;

export const TealBox = styled(Box)`
  transform: translateX(-5px) translateY(-5px);
  transition: transform 0.15s ease-in-out;
  animation: ${tealSlideReverse} 0.25s forwards ease-out;
`;

const pinkSlide = keyframes`
0% {
  transform: translateX(5px) translateY(5px);
}

30% {
  transform: translateX(-5px) translateY(5px);
}

60% {
  transform: translateX(-6px) translateY(-2px) scale(1.025);
}

100% {
  transform: translateX(-1px) translateY(-1px) scale(1.025);
}
`;

const pinkSlideReverse = keyframes`
0% {
  transform: translateX(0) translateY(0);
}

30% {
  transform: translateX(-4px) translateY(0);
}

50% {
  transform: translateX(-5px) translateY(5px);
}

100% {
  transform: translateX(5px) translateY(5px);
}
`;

export const PinkBox = styled(Box)`
  transform: translateX(5px) translateY(5px);
  transition: transform 0.15s ease-in-out;
  mix-blend-mode: screen;
  animation: ${pinkSlideReverse} 0.2s forwards ease-out;
`;

export const MainButton = styled(Button)`
  &:hover {
    ${TealBox} {
      animation: ${tealSlide} 0.2s forwards ease-out;
    }

    ${PinkBox} {
      animation: ${pinkSlide} 0.25s forwards ease-out;
      animation-delay: 0.05s;
    }
  }
`;
