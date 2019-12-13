/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import Home from '../index';

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
          title: 'Home',
          content: [
            {
              image: '/img/hpedev.png',
              title: 'HPE Developer',
              description:
                'Good things come to those who collaborate and make ideas happen.',
              category: null,
            },
            {
              image: null,
              title: 'The 🧠 Design Thinking Workshop Handbook',
              description: `In this book you'll learn how to put the
                thinking-based framework popularize by the Standford
                d.school into practice so you can take on challenges
                in your organization and reach insightful solutions.`,
              category: 'Research',
            },
          ],
        },
      },
    };
    const tree = renderer.create(<Home data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
