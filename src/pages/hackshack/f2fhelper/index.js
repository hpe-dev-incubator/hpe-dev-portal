import React from 'react';
// eslint-disable-next-line max-len
import GrommetThemeWrapper from '../../../components/hackshack/Grommet/GrommetThemeWrapper';
import Student from './template';

const Students = (props) => {
  return (
    <GrommetThemeWrapper>
      <Student {...props} />
    </GrommetThemeWrapper>
  );
};

export default Students;
