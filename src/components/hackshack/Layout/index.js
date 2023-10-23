import React, {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useState,
} from 'react';
import { useLocation } from '@reach/router';
import PropTypes from 'prop-types';
import { Box, ResponsiveContext, Text, Button } from 'grommet';
import { Close } from 'grommet-icons';
import { ResponsiveLayout, StyledLayer } from './styles';
// import { Header as HackShackHeader, SideNav } from '../index';
import { SideNav } from '../index';
// import { Header as HPEDevHeader } from '../../index';
import { AppContext } from '../../../providers/AppProvider';

const Layout = ({ children, background }) => {
  const size = useContext(ResponsiveContext);
  const location = useLocation();
  const { data } = useContext(AppContext);
  const [layer, setLayer] = useState(false);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { size });
    }

    return child;
  });

  return (
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
        {/* {location.pathname.includes('/hackshack') && size !== 'small' ? (
          <HPEDevHeader data={data} />
        ) : (
          <HackShackHeader setLayer={setLayer} />
        )} */}

        <Box direction="row">
          {location.pathname.includes('/hackshack') && size !== 'small' && (
            <Box margin={{ top: 'xlarge', left: 'large' }}>
              <SideNav data={data} />
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
              <SideNav data={data} />
            </Box>
          </Box>
        </StyledLayer>
      )}
    </ResponsiveLayout>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
};

export default Layout;
