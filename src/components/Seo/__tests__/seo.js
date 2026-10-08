import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from 'gatsby';
import Helmet from 'react-helmet';
import Seo from '../index';

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: 'My site',
        author: 'Tester',
        siteUrl: 'https://developer.hpe.com/',
      },
    },
  });
});

describe('Seo', () => {
  it.each([undefined, ''])('omits image metadata when image is %s', (image) => {
    const tree = renderer.create(<Seo title="Platform" image={image} />);
    const { meta } = tree.root.findByType(Helmet).props;
    expect(
      meta.filter((entry) => /image/.test(entry.property || entry.name)),
    ).toEqual([]);
    expect(meta).toContainEqual({ property: 'og:title', content: 'Platform' });
    tree.unmount();
  });

  it.each([
    ['/img/platform.png', 'https://developer.hpe.com/img/platform.png'],
    ['https://example.com/image.png', 'https://example.com/image.png'],
  ])('uses an absolute image URL for %s', (image, expected) => {
    const tree = renderer.create(<Seo title="Platform" image={image} />);
    const { meta } = tree.root.findByType(Helmet).props;
    expect(meta).toContainEqual({ property: 'og:image', content: expected });
    expect(meta).toContainEqual({ name: 'twitter:image', content: expected });
    tree.unmount();
  });

  it('omits image metadata for SVG images, which LinkedIn/X cannot render', () => {
    const tree = renderer.create(
      <Seo title="Platform" image="/img/platforms/Greenlake.svg" />,
    );
    const { meta } = tree.root.findByType(Helmet).props;
    expect(
      meta.filter((entry) => /image/.test(entry.property || entry.name)),
    ).toEqual([]);
    tree.unmount();
  });

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
