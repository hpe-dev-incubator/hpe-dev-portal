import React from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import ReplaysTemplate from './template';

const Replays = (props) => {
  return (
    <Grommet theme={hpe}>
      <ReplaysTemplate {...props} />
    </Grommet>
  );
};

export default Replays;
