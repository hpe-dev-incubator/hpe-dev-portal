import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(
  {
    global: {
      colors: {
        // new HPE secondary colors starting 9/1/2019. These aren't in grommet's HPE theme yet
        develop: '#FEC901', // HPE Yellow
        design: '#7630EA', // HPE Medium Purple
        event: '#CCCCCC',
        community: '#0D5265', // HPE Dark Blue
        'open source': '#7630EA', // HPE Medium Purple
        research: '#33DAC8', // HPE Medium Blue
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
