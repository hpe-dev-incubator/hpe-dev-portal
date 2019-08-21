import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import NotFoundPage from '../index';

// Data for SEO component
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

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <NotFoundPage
          data={{
            site: {
              siteMetadata: {
                title: 'My Test Site',
              },
            },
          }}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
