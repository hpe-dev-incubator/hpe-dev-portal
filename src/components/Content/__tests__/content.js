import React from 'react';
import renderer from 'react-test-renderer';

import Content from '../index';

describe('Content', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Content width="medium">This is my content</Content>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
