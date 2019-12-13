/* eslint-disable max-len */
// import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const hpeLight = {
  name: 'HPE bright',
  rounding: 0,
  spacing: 24,
  global: {
    colors: {
      brand: '#00C781',
      'accent-1': '#1BEBC9',
      'accent-2': '#7630EA',
      'accent-3': '#FE8702',
      'accent-4': '#FEC901',
      'neutral-1': '#0D5265',
      'neutral-2': '#0083B3',
      'neutral-3': '#80746E',
      'neutral-4': '#767676',
      focus: '#2AD2C9',
      'status-critical': '#D02828',
      'status-warning': '#FEC901',
      'status-ok': '#00C781',
      background: '#ffffff',
    },
    font: {
      family: "'Metric', Arial, sans-serif",
      face:
        '@font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Regular.woff") format(\'woff\');\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Bold.woff") format(\'woff\');\n          font-weight: 700;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Semibold.woff") format(\'woff\');\n          font-weight: 600;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Light.woff") format(\'woff\');\n          font-weight: 100;\n        }',
      size: '18px',
      height: '24px',
      maxWidth: '432px',
    },
    control: {
      border: {
        radius: '0px',
      },
    },
    borderSize: {
      xsmall: '1px',
      small: '2px',
      medium: '4px',
      large: '12px',
      xlarge: '24px',
    },
    breakpoints: {
      small: {
        value: 768,
        borderSize: {
          xsmall: '1px',
          small: '2px',
          medium: '4px',
          large: '6px',
          xlarge: '12px',
        },
        edgeSize: {
          none: '0px',
          hair: '1px',
          xxsmall: '2px',
          xsmall: '3px',
          small: '6px',
          medium: '12px',
          large: '24px',
          xlarge: '48px',
        },
        size: {
          xxsmall: '24px',
          xsmall: '48px',
          small: '96px',
          medium: '192px',
          large: '384px',
          xlarge: '768px',
          full: '100%',
        },
      },
      medium: {
        value: 1536,
      },
      large: {},
    },
    edgeSize: {
      none: '0px',
      hair: '1px',
      xxsmall: '3px',
      xsmall: '6px',
      small: '12px',
      medium: '24px',
      large: '48px',
      xlarge: '96px',
      responsiveBreakpoint: 'small',
    },
    input: {
      padding: '12px',
      weight: 600,
    },
    spacing: '24px',
    size: {
      xxsmall: '48px',
      xsmall: '96px',
      small: '192px',
      medium: '384px',
      large: '768px',
      xlarge: '1152px',
      xxlarge: '1536px',
      full: '100%',
    },
  },
  email: 'eric.soderberg@hpe.com',
  date: '2019-08-29T22:10:56.000Z',
  anchor: {
    color: {
      dark: '#999999',
      light: '#444444',
    },
    fontWeight: 400,
  },
  button: {
    border: {
      width: '2px',
      radius: '18px',
    },
    padding: {
      vertical: '4px',
      horizontal: '22px',
    },
  },
  checkBox: {
    check: {
      radius: '0px',
    },
    toggle: {
      radius: '24px',
      size: '48px',
    },
    size: '24px',
  },
  radioButton: {
    size: '24px',
  },
  calendar: {
    small: {
      fontSize: '14px',
      lineHeight: 1.375,
      daySize: '27.428571428571427px',
    },
    medium: {
      fontSize: '18px',
      lineHeight: 1.45,
      daySize: '54.857142857142854px',
    },
    large: {
      fontSize: '30px',
      lineHeight: 1.11,
      daySize: '109.71428571428571px',
    },
  },
  clock: {
    analog: {
      hour: {
        width: '8px',
        size: '24px',
      },
      minute: {
        width: '4px',
        size: '12px',
      },
      second: {
        width: '3px',
        size: '9px',
      },
      size: {
        small: '72px',
        medium: '96px',
        large: '144px',
        xlarge: '216px',
        huge: '288px',
      },
    },
    digital: {
      text: {
        xsmall: {
          size: '10px',
          height: 1.5,
        },
        small: {
          size: '14px',
          height: 1.43,
        },
        medium: {
          size: '18px',
          height: 1.375,
        },
        large: {
          size: '22px',
          height: 1.167,
        },
        xlarge: {
          size: '26px',
          height: 1.1875,
        },
        xxlarge: {
          size: '34px',
          height: 1.125,
        },
      },
    },
  },
  heading: {
    level: {
      '1': {
        small: {
          size: '34px',
          height: '40px',
          maxWidth: '816px',
        },
        medium: {
          size: '50px',
          height: '56px',
          maxWidth: '1200px',
        },
        large: {
          size: '82px',
          height: '88px',
          maxWidth: '1968px',
        },
        xlarge: {
          size: '114px',
          height: '120px',
          maxWidth: '2736px',
        },
      },
      '2': {
        small: {
          size: '26px',
          height: '32px',
          maxWidth: '624px',
        },
        medium: {
          size: '34px',
          height: '40px',
          maxWidth: '816px',
        },
        large: {
          size: '50px',
          height: '56px',
          maxWidth: '1200px',
        },
        xlarge: {
          size: '66px',
          height: '72px',
          maxWidth: '1584px',
        },
      },
      '3': {
        small: {
          size: '22px',
          height: '28px',
          maxWidth: '528px',
        },
        medium: {
          size: '26px',
          height: '32px',
          maxWidth: '624px',
        },
        large: {
          size: '34px',
          height: '40px',
          maxWidth: '816px',
        },
        xlarge: {
          size: '42px',
          height: '48px',
          maxWidth: '1008px',
        },
      },
      '4': {
        small: {
          size: '18px',
          height: '24px',
          maxWidth: '432px',
        },
        medium: {
          size: '18px',
          height: '24px',
          maxWidth: '432px',
        },
        large: {
          size: '18px',
          height: '24px',
          maxWidth: '432px',
        },
        xlarge: {
          size: '18px',
          height: '24px',
          maxWidth: '432px',
        },
      },
      '5': {
        small: {
          size: '16px',
          height: '22px',
          maxWidth: '384px',
        },
        medium: {
          size: '16px',
          height: '22px',
          maxWidth: '384px',
        },
        large: {
          size: '16px',
          height: '22px',
          maxWidth: '384px',
        },
        xlarge: {
          size: '16px',
          height: '22px',
          maxWidth: '384px',
        },
      },
      '6': {
        small: {
          size: '14px',
          height: '20px',
          maxWidth: '336px',
        },
        medium: {
          size: '14px',
          height: '20px',
          maxWidth: '336px',
        },
        large: {
          size: '14px',
          height: '20px',
          maxWidth: '336px',
        },
        xlarge: {
          size: '14px',
          height: '20px',
          maxWidth: '336px',
        },
      },
    },
  },
  paragraph: {
    small: {
      size: '14px',
      height: '20px',
      maxWidth: '336px',
    },
    medium: {
      size: '18px',
      height: '24px',
      maxWidth: '432px',
    },
    large: {
      size: '22px',
      height: '28px',
      maxWidth: '528px',
    },
    xlarge: {
      size: '26px',
      height: '32px',
      maxWidth: '624px',
    },
    xxlarge: {
      size: '34px',
      height: '40px',
      maxWidth: '816px',
    },
  },
  text: {
    xsmall: {
      size: '12px',
      height: '18px',
      maxWidth: '288px',
    },
    small: {
      size: '14px',
      height: '20px',
      maxWidth: '336px',
    },
    medium: {
      size: '18px',
      height: '24px',
      maxWidth: '432px',
    },
    large: {
      size: '22px',
      height: '28px',
      maxWidth: '528px',
    },
    xlarge: {
      size: '26px',
      height: '32px',
      maxWidth: '624px',
    },
    xxlarge: {
      size: '34px',
      height: '40px',
      maxWidth: '816px',
    },
  },
};

const theme = deepMerge(hpeLight, {
  global: {
    colors: {
      // new HPE secondary colors starting 9/1/2019. These aren't in grommet's HPE theme yet
      'accent-1': '#32DAC8', // HPE Medium blue - was #1BEBC9
      'accent-3': '#FE8702', // Aruba Orange - was #FE8702
    },
  },
  anchor: {
    color: {
      light: '#00C781',
      dark: '#00C781',
    },
  },
  heading: {
    extend: css`
      color: #333333;
    `,
    weight: 700,
    level: {
      3: {
        font: {
          weight: '500',
        },
      },
    },
  },
  paragraph: {
    extend: css`
      font-weight: 100;
      max-width: 100%;
    `,
  },
});

export default theme;
