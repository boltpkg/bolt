// @flow
import * as versions from '../versions';

const ONE_POINT_OH = versions.toVersion('1.0.0');
const BETA_VERSION = versions.toVersion('2.0.0-beta.2');
const ALPHA_VERSION = versions.toVersion('3.0.0-alpha.0');

describe('versions', () => {
  test('.toVersion()', () => {
    expect(versions.toVersion('1.0.0')).toBe('1.0.0');
    expect(() => versions.toVersion('nope')).toThrow();
  });

  test('.getPrereleaseType()', () => {
    expect(versions.getPrereleaseType(ONE_POINT_OH)).toBe(null);
    expect(versions.getPrereleaseType(BETA_VERSION)).toBe('beta');
    expect(versions.getPrereleaseType(ALPHA_VERSION)).toBe('alpha');
  });

  test('.increment()', () => {
    expect(versions.increment(ONE_POINT_OH, 'patch')).toBe('1.0.1');
    expect(versions.increment(ONE_POINT_OH, 'minor')).toBe('1.1.0');
    expect(versions.increment(ONE_POINT_OH, 'major')).toBe('2.0.0');
    expect(versions.increment(ONE_POINT_OH, 'prepatch')).toBe('1.0.1-beta.0');
    expect(versions.increment(ONE_POINT_OH, 'preminor')).toBe('1.1.0-beta.0');
    expect(versions.increment(ONE_POINT_OH, 'premajor')).toBe('2.0.0-beta.0');
    expect(versions.increment(ONE_POINT_OH, 'prerelease')).toBe('1.0.1-beta.0');

    expect(versions.increment(BETA_VERSION, 'patch')).toBe('2.0.0');
    expect(versions.increment(BETA_VERSION, 'minor')).toBe('2.0.0');
    expect(versions.increment(BETA_VERSION, 'major')).toBe('2.0.0');
    expect(versions.increment(BETA_VERSION, 'prepatch')).toBe('2.0.1-beta.0');
    expect(versions.increment(BETA_VERSION, 'preminor')).toBe('2.1.0-beta.0');
    expect(versions.increment(BETA_VERSION, 'premajor')).toBe('3.0.0-beta.0');
    expect(versions.increment(BETA_VERSION, 'prerelease')).toBe('2.0.0-beta.3');

    expect(versions.increment(ALPHA_VERSION, 'patch')).toBe('3.0.0');
    expect(versions.increment(ALPHA_VERSION, 'minor')).toBe('3.0.0');
    expect(versions.increment(ALPHA_VERSION, 'major')).toBe('3.0.0');
    expect(versions.increment(ALPHA_VERSION, 'prepatch')).toBe('3.0.1-alpha.0');
    expect(versions.increment(ALPHA_VERSION, 'preminor')).toBe('3.1.0-alpha.0');
    expect(versions.increment(ALPHA_VERSION, 'premajor')).toBe('4.0.0-alpha.0');
    expect(versions.increment(ALPHA_VERSION, 'prerelease')).toBe(
      '3.0.0-alpha.1'
    );
  });
});
