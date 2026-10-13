import getPlatformShareLinks from './platform-share';

describe('platform sharing links', () => {
  it.each(['platform', 'greenlake'])(
    'shares the public URL for %s pages',
    (source) => {
      const links = getPlatformShareLinks(
        'https://developer.hpe.com/',
        source,
        '/openchami/home/',
        'HPE & OpenCHAMI',
      );
      [links.linkedin, links.x, links.facebook].forEach((link) => {
        const parsed = new URL(link);
        expect(
          parsed.searchParams.get('url') || parsed.searchParams.get('u'),
        ).toBe(`https://developer.hpe.com/${source}/openchami/home/`);
      });
      expect(new URL(links.x).searchParams.get('text')).toBe('HPE & OpenCHAMI');
      expect(new URL(links.linkedin).pathname).toBe('/sharing/share-offsite/');
      expect(new URL(links.x).pathname).toBe('/intent/tweet');
      expect(new URL(links.facebook).pathname).toBe('/sharer/sharer.php');
      const email = new URL(links.email);
      expect(email.protocol).toBe('mailto:');
      expect(email.pathname).toBe('');
      expect(email.searchParams.get('subject')).toBe('HPE & OpenCHAMI');
      expect(email.searchParams.get('body')).toBe(
        `https://developer.hpe.com/${source}/openchami/home/`,
      );
    },
  );

  it('encodes reserved characters without adding share parameters', () => {
    const links = getPlatformShareLinks(
      'https://developer.hpe.com/',
      'platform',
      '/example/home/',
      'Compute? AI & cloud #1 + automation',
    );
    const params = new URL(links.x).searchParams;
    expect(params.get('text')).toBe('Compute? AI & cloud #1 + automation');
    expect(Array.from(params.keys())).toEqual(['url', 'text']);
    const emailParams = new URL(links.email).searchParams;
    expect(emailParams.get('subject')).toBe(
      'Compute? AI & cloud #1 + automation',
    );
    expect(emailParams.get('body')).toBe(
      'https://developer.hpe.com/platform/example/home/',
    );
    expect(Array.from(emailParams.keys())).toEqual(['subject', 'body']);
  });
});
