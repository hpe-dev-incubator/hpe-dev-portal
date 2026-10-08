import { deepMerge } from 'grommet/utils';
import { hpe } from 'grommet-theme-hpe';

const theme = deepMerge(hpe, {
  global: {
    font: {
      family: 'HPE Graphik, Metric, sans-serif',
    },
  },
});

export default theme;
