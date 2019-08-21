import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import HomePage from '../index';

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

describe('HomePage', () => {
  it('renders correctly', () => {
    const data = {
      site: {
        siteMetadata: {
          title: 'My site',
        },
      },
      markdownRemark: {
        frontmatter: {
          heroBg: '/img/test.jpg',
          intro:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra sodales urna, eget finibus orci rutrum non. Vivamus blandit, erat vel condimentum dapibus.',
          title: 'Our Coolest Product',
          videos: [
            {
              photo: '/img/video-thumb-01.jpg',
              title: 'Learn About Things',
              url: 'https://www.youtube.com/watch?v=test',
            },
            {
              photo: '/img/video-thumb-02.jpg',
              title: 'Learn About Things 2',
              url: 'https://www.youtube.com/watch?v=test',
            },
          ],
        },
      },
    };
    const tree = renderer.create(<HomePage data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
