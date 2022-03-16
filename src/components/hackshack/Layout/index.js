import React, {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Grommet, Box, ResponsiveContext, Text, Button } from 'grommet';
import { Close } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { ResponsiveLayout, StyledLayer } from './styles';
import { Header as HackShackHeader, SideNav } from '../index';
import { Header as HPEDevHeader } from '../../index';

const customHpe = deepMerge(hpe, {
  global: {
    breakpoints: {
      small: {
        value: 900,
      },
    },
  },
});

const Layout = ({ children, background }) => {
  const [layer, setLayer] = useState(false);
  const size = useContext(ResponsiveContext);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { size });
    }

    return child;
  });

  return (
    <Grommet
      theme={customHpe}
      themeMode="dark"
      background="#151d29"
      style={{ overflowX: 'hidden' }}
      // full
    >
      <ResponsiveLayout
        background={{
          image: `url(${background})`,
          size: '100%',
          position: 'top center',
        }}
        justify="between"
        layer={layer}
      >
        <Box>
          <HPEDevHeader />
          <HackShackHeader setLayer={setLayer} size={size} />
          <Box direction="row">
            {size !== 'small' && (
              <Box margin={{ top: 'xlarge', left: 'large' }}>
                <SideNav size={size} />
              </Box>
            )}
            <Box
              align={size !== 'small' ? 'start' : 'center'}
              fill="horizontal"
              direction="column"
              pad="xlarge"
            >
              {childrenWithProps}
            </Box>
          </Box>
        </Box>
        {layer && (
          <StyledLayer>
            <Box pad={{ top: 'xlarge', right: 'large' }}>
              <Box
                direction="row"
                align="center"
                justify="end"
                margin={{ bottom: 'xlarge' }}
              >
                <Text color="#FFFFFF">CLOSE</Text>
                <Button icon={<Close />} onClick={() => setLayer(false)} />
              </Box>
              <Box align="start" gap="large" pad="xlarge">
                <SideNav size={size} />
              </Box>
            </Box>
          </StyledLayer>
        )}
      </ResponsiveLayout>
    </Grommet>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
};

export default Layout;
