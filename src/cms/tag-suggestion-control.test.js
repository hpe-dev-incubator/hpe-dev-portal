import React from 'react';
import { act, create } from 'react-test-renderer';
import TagSuggestionControl from './tag-suggestion-control';

describe('tag suggestion control', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('shows an error and keeps manual entry available when suggestions fail', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    let control;
    await act(async () => {
      control = create(
        <TagSuggestionControl
          forID="tag-2"
          value="existing"
          onChange={() => {}}
        />,
      );
    });

    expect(control.root.findByProps({ role: 'alert' })).toBeDefined();
    expect(control.root.findByType('input').props.value).toBe('existing');
  });

  it('suggests existing tags without changing the saved value or preventing new tags', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ['AI', 'storage'],
    });
    const onChange = jest.fn();
    let control;
    await act(async () => {
      control = create(
        <TagSuggestionControl
          forID="tag-1"
          value="Existing custom tag"
          onChange={onChange}
        />,
      );
    });

    expect(control.root.findByType('input').props.value).toBe(
      'Existing custom tag',
    );
    expect(
      control.root.findAllByType('option').map((option) => option.props.value),
    ).toEqual(['AI', 'storage']);
    act(() => {
      control.root.findByType('input').props.onChange({
        target: { value: 'A new tag' },
      });
    });
    expect(onChange).toHaveBeenCalledWith('A new tag');
  });
});
