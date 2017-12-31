// @flow
import * as options from '../options';

describe('options', () => {
  test('string');
  test('boolean');

  describe('toScriptFlags', () => {
    it('returns empty array if there were no custom flags passes', async () => {
      const scriptFlags = await options.toScriptFlags({
        '--': []
      });
      expect(scriptFlags).toEqual([]);
    });
    it('returns flags with value with the custom flags that are passed', async () => {
      const scriptFlags = await options.toScriptFlags({
        '--': [],
        coverage: true,
        target: 'Node9'
      });
      expect(scriptFlags).toEqual(['--coverage', '--target=Node9']);
    });
  });
});
