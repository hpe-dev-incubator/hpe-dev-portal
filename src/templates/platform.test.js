import { Book, CirclePlay, Copy, HelpBook } from 'grommet-icons';
import {
  getCardDisplayTitle,
  getCardIcon,
  parseAndExtractBulletCards,
} from './platform';

jest.mock('../components', () => ({ Markdown: 'div' }));
jest.mock('../components/Breadcrumbs', () => () => null);
jest.mock('../components/CarouselNavButtons', () => () => null);
jest.mock('../components/PlatformHeroSectionGrommet', () => () => null);
jest.mock('../hooks/use-site-metadata', () => ({
  useSiteMetadata: jest.fn(),
}));

const cardGroups = (sections) =>
  sections.filter((section) => section.kind === 'cards');

describe('platform resource cards', () => {
  it('renders tagged video links with inline and continuation descriptions', () => {
    const sections = parseAndExtractBulletCards(
      [
        '### Technical Demos',
        '',
        '* [video] [Playlist:](https://www.youtube.com/playlist?list=example) Short videos covering product features.',
        '* [video] [VM Essentials:](https://www.youtube.com/watch?v=example) An overview.',
        'More details on the next line.',
        '* [docs] [API reference](https://example.com/api)',
        '',
        '## Community',
      ].join('\n'),
    );
    const groups = cardGroups(sections);
    expect(groups).toHaveLength(1);
    expect(groups[0].cards).toEqual([
      {
        type: 'video',
        title: 'Playlist:',
        link: 'https://www.youtube.com/playlist?list=example',
        description: 'Short videos covering product features.',
      },
      {
        type: 'video',
        title: 'VM Essentials:',
        link: 'https://www.youtube.com/watch?v=example',
        description: 'An overview. More details on the next line.',
      },
      {
        type: 'docs',
        title: 'API reference',
        link: 'https://example.com/api',
        description: '',
      },
    ]);
    expect(getCardIcon(groups[0].cards[0], 0)).toBe(CirclePlay);
    expect(sections[2].body).toContain('## Community');
  });

  it('renders video-only groups with CirclePlay and preserves their titles', () => {
    const sections = parseAndExtractBulletCards(
      [
        '* [video] [API reference walkthrough](https://example.com/watch)',
        '* [VIDEO] [Developer guide demo](https://example.com/demo)',
      ].join('\n'),
    );
    const groups = cardGroups(sections);
    expect(groups).toHaveLength(1);
    expect(groups[0].cards).toHaveLength(2);
    groups[0].cards.forEach((card, index) => {
      expect(getCardIcon(card, index)).toBe(CirclePlay);
      expect(getCardDisplayTitle(card)).toBe(card.title);
    });
  });

  it.each([
    ['guide', Copy],
    ['docs', Book],
    ['faq', HelpBook],
    ['video', CirclePlay],
  ])('uses the correct icon for a %s card in a mixed group', (type, icon) => {
    const sections = parseAndExtractBulletCards(
      `* [${type}] [Resource](https://example.com/resource)\n* [docs] [Docs](https://example.com/docs)`,
    );
    const card = cardGroups(sections)[0].cards[0];
    expect(getCardIcon(card, 0)).toBe(icon);
    expect(getCardDisplayTitle(card)).toBe('Resource');
  });

  it('does not infer a video category from untagged video links', () => {
    const body =
      '* [Video](https://www.youtube.com/watch?v=one)\n* [Video demo](https://www.youtube.com/watch?v=two)';
    expect(cardGroups(parseAndExtractBulletCards(body))).toHaveLength(0);
  });

  it('renders multiple tagged groups in their original positions', () => {
    const sections = parseAndExtractBulletCards(
      [
        '## API',
        '',
        '* [guide] [Getting started](https://example.com/start)',
        '* [docs] [OpenAPI](https://example.com/api)',
        '',
        '## Terraform',
        '',
        '* [Terraform documentation](https://example.com/terraform)',
        '',
        '## Plugins',
        '',
        '* [docs] [Plugin docs](https://example.com/plugins)',
        'Plugin description.',
        '* [guide] [Plugin API](https://example.com/plugin-api)',
        '* [faq] [Plugin questions](https://example.com/faq)',
        '',
        '## Community',
        '',
        'Community information.',
      ].join('\n'),
    );

    expect(sections.map((section) => section.kind)).toEqual([
      'markdown',
      'cards',
      'markdown',
      'cards',
      'markdown',
    ]);
    expect(sections[0].body).toContain('## API');
    expect(sections[1].cards.map((card) => card.title)).toEqual([
      'Getting started',
      'OpenAPI',
    ]);
    expect(sections[2].body).toContain('## Terraform');
    expect(sections[2].body).toContain('* [Terraform documentation]');
    expect(sections[2].body).toContain('## Plugins');
    expect(sections[3].cards).toHaveLength(3);
    expect(sections[3].cards[0].description).toBe('Plugin description.');
    expect(sections[4].body).toContain('Community information.');
  });

  it('keeps other untagged groups as markdown when a tagged group exists', () => {
    const sections = parseAndExtractBulletCards(
      [
        '* [API docs](https://example.com/api)',
        '* [API reference](https://example.com/reference)',
        '',
        '## Plugins',
        '',
        '* [docs] [Plugins](https://example.com/plugins)',
        '* [guide] [Start](https://example.com/start)',
      ].join('\n'),
    );

    expect(cardGroups(sections)).toHaveLength(1);
    expect(sections[0].body).toContain('* [API docs]');
    expect(cardGroups(sections)[0].cards[0].title).toBe('Plugins');
  });

  it('preserves single preferred-group behavior for untagged pages', () => {
    const sections = parseAndExtractBulletCards(
      [
        '* [API docs](https://example.com/api)',
        '* [Website](https://example.com)',
        '',
        '## Plugins',
        '',
        '* [Plugin docs](https://example.com/plugins)',
        '* [Plugin reference](https://example.com/reference)',
      ].join('\n'),
    );

    expect(cardGroups(sections)).toHaveLength(1);
    expect(cardGroups(sections)[0].cards[0].title).toBe('Plugin docs');
    expect(sections[0].body).toContain('* [API docs]');
  });

  it('chooses the first untagged group when inferred scores are tied', () => {
    const sections = parseAndExtractBulletCards(
      [
        '* [API docs](https://example.com/api)',
        '* [Website](https://example.com)',
        '',
        '## Plugins',
        '',
        '* [Plugin docs](https://example.com/plugins)',
        '* [Website](https://example.com)',
      ].join('\n'),
    );

    expect(cardGroups(sections)).toHaveLength(1);
    expect(cardGroups(sections)[0].cards[0].title).toBe('API docs');
  });

  it.each([
    '## Empty section',
    '* [docs] [One link](https://example.com)',
    '* [Home](https://example.com)\n* [About](https://example.com/about)',
    '* [unknown] [Home](https://example.com)\n* [About](https://example.com/about)',
  ])('leaves ineligible markdown unchanged: %s', (body) => {
    expect(parseAndExtractBulletCards(body)).toEqual([
      { kind: 'markdown', start: 0, body },
    ]);
  });

  it('keeps headings out of card descriptions even without blank lines', () => {
    const sections = parseAndExtractBulletCards(
      [
        '* [docs] [API](https://example.com/api)',
        '* [guide] [Start](https://example.com/start)',
        '## Next section',
        '* [faq] [Questions](https://example.com/questions)',
        '* [docs] [Reference](https://example.com/reference)',
      ].join('\n'),
    );

    expect(sections.map((section) => section.kind)).toEqual([
      'cards',
      'markdown',
      'cards',
    ]);
    expect(sections[0].cards[1].description).toBe('');
    expect(sections[1].body).toBe('## Next section');
  });

  it('renders tagged intro groups, including pages without headings', () => {
    const intro = [
      'Learn more',
      '* [faq] [Product](https://example.com/product)',
      '* [guide] [Features](https://example.com/features)',
    ].join('\n');
    expect(
      cardGroups(
        parseAndExtractBulletCards(intro, { inferAfterFirstHeading: true }),
      ),
    ).toHaveLength(1);
    const sections = parseAndExtractBulletCards(
      `${intro}\n\n## API\n\n* [docs] [API](https://example.com/api)\n* [guide] [Start](https://example.com/start)`,
      { inferAfterFirstHeading: true },
    );
    expect(cardGroups(sections)).toHaveLength(2);
    expect(sections[0].body).toBe('Learn more');
    expect(sections[2].body).toContain('## API');
  });

  it('does not infer tiles from untagged intro links', () => {
    const intro =
      '* [API docs](https://example.com/api)\n* [Reference](https://example.com/reference)';
    expect(
      cardGroups(
        parseAndExtractBulletCards(intro, { inferAfterFirstHeading: true }),
      ),
    ).toHaveLength(0);
    const sections = parseAndExtractBulletCards(
      `${intro}\n\n## Resources\n\n* [Docs](https://example.com/docs)\n* [Website](https://example.com)`,
      { inferAfterFirstHeading: true },
    );
    expect(sections[0].body).toContain(intro);
    expect(cardGroups(sections)).toHaveLength(1);
    expect(cardGroups(sections)[0].cards[0].title).toBe('Docs');
  });

  it('extracts intro, API, and plugin groups from a Morpheus-style page', () => {
    const rawBody = [
      'Learn more on hpe.com',
      '* [faq] [HPE Morpheus](https://example.com/product)',
      '* [guide] [Features comparaison](https://example.com/features)',
      '',
      '## Morpheus API',
      '',
      '* [guide] [Getting started with the API](https://example.com/start)',
      '* [docs] [OpenAPI specifications on GitHub](https://example.com/api)',
      '',
      '## Plugin Framework',
      '',
      '* [docs] [Plugin documentation](https://example.com/plugins)',
      '* [guide] [Plugin API reference](https://example.com/plugin-api)',
      '* [faq] [Build a plugin](https://example.com/tutorial)',
    ].join('\n');
    const groups = cardGroups(
      parseAndExtractBulletCards(rawBody, { inferAfterFirstHeading: true }),
    );

    expect(groups).toHaveLength(3);
    expect(groups[0].cards.map((card) => card.title)).toEqual([
      'HPE Morpheus',
      'Features comparaison',
    ]);
    expect(groups[1].cards.map((card) => card.title)).toEqual([
      'Getting started with the API',
      'OpenAPI specifications on GitHub',
    ]);
    expect(groups[2].cards).toHaveLength(3);
  });
});
