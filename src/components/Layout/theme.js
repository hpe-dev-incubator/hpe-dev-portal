import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';

const theme = deepMerge(hpe, {
  global: {
    // Prefer new brand font while preserving existing HPE Metric fallback.
    font: {
      family: "'HPE Graphik', 'Metric', Arial, sans-serif",
    },
  },
});

export default theme;
