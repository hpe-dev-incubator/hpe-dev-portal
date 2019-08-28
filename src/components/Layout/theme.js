import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(
  {
    global: {
      colors: {
        develop: '#FEC901',
        design: '#7630EA',
        event: '#CCCCCC',
        community: '#0E5265',
        'open source': '#7630EA',
        research: '#33DAC8',
      },
    },
    heading: {
      extend: css`
        font-weight: 700;
        color: #333333;
      `,
    },
    paragraph: {
      extend: css`
        font-weight: 100;
        max-width: 100%;
      `,
    },
  },
  hpe,
);

export default theme;
