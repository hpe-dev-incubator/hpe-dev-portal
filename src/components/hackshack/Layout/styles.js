import styled from 'styled-components';
import { Box, Layer } from 'grommet';

const ResponsiveLayout = styled(Box)`
  min-width: 366px;
  min-height: 100%;
  @supports (-moz-appearance: none) {
    filter: ${(props) => (props.layer ? 'blur(15px)' : 'none')};
  }
`;

const StyledLayer = styled(Layer)`
  background-color: rgba(38, 48, 64, 0.8);
  backdrop-filter: blur(15px);
`;

export { ResponsiveLayout, StyledLayer };
