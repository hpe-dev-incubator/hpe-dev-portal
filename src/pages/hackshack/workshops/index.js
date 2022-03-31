import React from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import WorkshopsTemplate from './template';

const Workshops = (props) => {
  return (
    <Grommet full theme={hpe}>
      <WorkshopsTemplate {...props} />
    </Grommet>
  );
};

export default Workshops;
