import styled from 'styled-components';
import { Box } from 'grommet';

// Aligns page content below a full-width ReusableHeroSection with the hero's left/right edges.
const HeroContent = styled(Box)`
  padding: 64px max(160px, calc((100% - 1600px) / 2));
`;

export default HeroContent;
