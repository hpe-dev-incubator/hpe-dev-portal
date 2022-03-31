import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Header as HeaderGrommet,
  ResponsiveContext,
} from 'grommet';
import { Menu } from 'grommet-icons';
import { ButtonLink } from '../..';

export const Header = ({ setLayer }) => {
  const size = useContext(ResponsiveContext);
  useEffect(() => {
    if (size !== 'small') setLayer(false);
  }, [size, setLayer]);

  return (
    <HeaderGrommet
      justify="between"
      pad={{ horizontal: 'medium', vertical: 'small' }}
    >
      {size === 'small' && (
        <Box flex={false}>
          <ButtonLink label="HPE Developer" to="/" />
        </Box>
      )}
      {size === 'small' && (
        <Box>
          <Button icon={<Menu />} onClick={() => setLayer(true)} />
        </Box>
      )}
    </HeaderGrommet>
  );
};
export default Header;

Header.propTypes = {
  setLayer: PropTypes.func,
};
