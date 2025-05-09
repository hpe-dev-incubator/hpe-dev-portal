import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import Layout from '../index';

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: 'My site',
        author: 'Tester',
      },
    },
  });
});

describe('Layout', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Layout width="medium">This is my app wrapper</Layout>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
