import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import Seo from '../index';

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

describe('Seo', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Seo
          description="my test description"
          lang="en"
          title="My Test Title"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
