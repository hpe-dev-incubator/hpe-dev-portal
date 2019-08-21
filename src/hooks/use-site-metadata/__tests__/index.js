import { useStaticQuery } from 'gatsby';
import { useSiteMetadata } from '../index';

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

describe('Use site metadata', () => {
  it('returns correctly', () => {
    const siteMetadata = useSiteMetadata();
    expect(siteMetadata).toStrictEqual({
      title: 'My site',
      author: 'Tester',
    });
  });
});
