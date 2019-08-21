import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(
  {
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
