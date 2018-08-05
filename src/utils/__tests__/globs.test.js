import { matchOnlyAndIgnore } from '../globs';

describe('globs', () => {
  test('matchOnlyAndIgnore', () => {
    const paths = ['package-foo', 'package-bar', 'package-baz'];

    expect(matchOnlyAndIgnore(paths)).toEqual(paths);
    expect(matchOnlyAndIgnore(paths, ['package-foo'])).toEqual(['package-foo']);
    expect(matchOnlyAndIgnore(paths, ['package-foo', 'package-bar'])).toEqual([
      'package-foo',
      'package-bar'
    ]);
    expect(
      matchOnlyAndIgnore(paths, ['package-foo', 'package-bar'], ['package-bar'])
    ).toEqual(['package-foo']);
    expect(matchOnlyAndIgnore(paths, [], ['package-bar'])).toEqual([
      'package-foo',
      'package-baz'
    ]);
    expect(matchOnlyAndIgnore(paths, 'package-ba*')).toEqual([
      'package-bar',
      'package-baz'
    ]);
    expect(matchOnlyAndIgnore(paths, null, 'package-ba*')).toEqual([
      'package-foo'
    ]);
  });
});
