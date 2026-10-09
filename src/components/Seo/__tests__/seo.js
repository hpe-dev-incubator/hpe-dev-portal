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
  it.each([undefined, ''])('uses the default image when image is %s', (image) => {
    const tree = renderer.create(<Seo title="Platform" image={image} />);
    const { meta } = tree.root.findByType(Helmet).props;
    expect(meta).toContainEqual({
      property: 'og:image',
      content: 'https://developer.hpe.com/images/developer-og.jpg',
    });
    expect(meta).toContainEqual({
      name: 'twitter:image',
      content: 'https://developer.hpe.com/images/developer-og.jpg',
    });
    expect(meta).toContainEqual({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    expect(meta).toContainEqual({ property: 'og:title', content: 'Platform' });
    tree.unmount();
  });

  it.each([
    '/img/platform.png',
    'https://example.com/image.png',
  ])('uses the site-wide image instead of %s', (image) => {
    const tree = renderer.create(<Seo title="Platform" image={image} />);
    const { meta } = tree.root.findByType(Helmet).props;
    const expected = 'https://developer.hpe.com/images/developer-og.jpg';
    expect(meta).toContainEqual({ property: 'og:image', content: expected });
    expect(meta).toContainEqual({ name: 'twitter:image', content: expected });
    expect(
      meta.filter((entry) => /og:image:(width|height)/.test(entry.property)),
    ).toEqual([]);
    tree.unmount();
  });

  it('uses the default image for SVG images, which LinkedIn/X cannot render', () => {
    const tree = renderer.create(
      <Seo title="Platform" image="/img/platforms/Greenlake.svg" />,
    );
    const { meta } = tree.root.findByType(Helmet).props;
    expect(meta).toContainEqual({
      property: 'og:image',
      content: 'https://developer.hpe.com/images/developer-og.jpg',
    });
    expect(meta).toContainEqual({
      name: 'twitter:image',
      content: 'https://developer.hpe.com/images/developer-og.jpg',
    });
    tree.unmount();
  });

  it('prevents custom metadata from overriding the site-wide image', () => {
    const tree = renderer.create(
      <Seo
        title="Article"
        meta={[
          { property: 'og:image', content: '/img/old.jpg' },
          { property: 'og:image:width', content: '200' },
          { name: 'twitter:image', content: '/img/old.jpg' },
          { name: 'robots', content: 'index,follow' },
        ]}
      />,
    );
    const { meta } = tree.root.findByType(Helmet).props;
    expect(
      meta.filter((entry) => /^(og:image|twitter:image)/.test(entry.property || entry.name)),
    ).toEqual([
      { property: 'og:image', content: 'https://developer.hpe.com/images/developer-og.jpg' },
      { name: 'twitter:image', content: 'https://developer.hpe.com/images/developer-og.jpg' },
    ]);
    expect(meta).toContainEqual({ name: 'robots', content: 'index,follow' });
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
