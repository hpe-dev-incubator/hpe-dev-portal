import React from 'react';
import renderer from 'react-test-renderer';
import Breadcrumbs from './index';

const title = 'Data Services on the HPE GreenLake platform';
const section =
  'Introduction to Data Services on the HPE GreenLake edge-to-cloud platform';

describe('Breadcrumbs', () => {
  it('renders linked ancestors and the full current label in a navigation list', () => {
    const onClick = jest.fn();
    const tree = renderer.create(
      <Breadcrumbs
        items={[
          { label: title, href: '#platform-content', onClick },
          { label: section },
        ]}
      />,
    );
    expect(tree.root.findByType('nav').props['aria-label']).toBe('Breadcrumb');
    expect(tree.root.findAllByType('li')).toHaveLength(2);
    const link = tree.root.findByType('a');
    expect(link.props.href).toBe('#platform-content');
    expect(link.children).toEqual([title]);
    link.props.onClick();
    expect(onClick).toHaveBeenCalledTimes(1);
    const current = tree.root.findByProps({ 'aria-current': 'page' });
    expect(current.children).toEqual([section]);
    const navigation = tree.toJSON();
    expect(navigation).toHaveStyleRule('font-size', '20px');
    expect(navigation).toHaveStyleRule('min-width', '0');
    expect(navigation).toHaveStyleRule('flex-wrap', 'wrap', {
      modifier: '> ol',
    });
  });

  it('matches the Figma reference typography, spacing and separator', () => {
    const tree = renderer.create(
      <Breadcrumbs
        items={[
          { label: 'Hybrid Cloud', href: '/topic/hybrid-cloud/' },
          { label: 'Overview' },
        ]}
      />,
    );
    const navigation = tree.toJSON();
    expect(navigation).toHaveStyleRule('font-weight', '400');
    expect(navigation).toHaveStyleRule('line-height', '24px');
    expect(navigation).toHaveStyleRule('padding', '20px 0');
    expect(navigation).toHaveStyleRule('color', '#606a70');
    expect(navigation).toHaveStyleRule('gap', '8px 16px', { modifier: '> ol' });
    expect(navigation).toHaveStyleRule('gap', '16px', { modifier: 'li' });
    expect(navigation).toHaveStyleRule('font', 'inherit', { modifier: 'li' });
    expect(navigation).toHaveStyleRule('font-weight', '500', {
      modifier: 'span[aria-current]',
    });
    expect(navigation).toHaveStyleRule('color', '#3e4550', {
      modifier: 'span[aria-current]',
    });
    const separator = tree.root.findByType('img');
    expect(separator.props.src).toBe('/images/breadcrumb-separator.svg');
    expect(separator.props.alt).toBe('');
    expect(separator.parent.props['aria-hidden']).toBe('true');
  });

  it('supports inverse colors for dark topic heroes', () => {
    const tree = renderer.create(
      <Breadcrumbs
        inverse
        items={[{ label: 'Topics', href: '/topics' }, { label: 'Compute' }]}
      />,
    );
    expect(tree.toJSON()).toHaveStyleRule('color', '#ffffff');
  });
});
