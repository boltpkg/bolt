// @flow

import * as npm from '../npm';
import Project from '../../Project';
import * as processes from '../processes';
import fixtures from 'fixturez';
import containDeep from 'jest-expect-contain-deep';

const f = fixtures(__dirname);

jest.mock('../logger');
jest.mock('../processes');

let REAL_ENV = process.env;

const unsafeProcesses: any & typeof processes = processes;

describe('npm', () => {
  describe('publish', () => {
    let cwd;
    let result;

    beforeEach(async () => {
      cwd = f.find('simple-project');
    });

    afterEach(async () => {
      process.env = REAL_ENV;
    });

    test('returns published true when npm publish <package> is successesful', async () => {
      unsafeProcesses.spawn.mockImplementation(() => Promise.resolve());
      result = await npm.publish('simple-project', {
        cwd
      });
      expect(result).toEqual({ published: true });
    });

    test('returns published false when npm publish <package> is unsuccessesful', async () => {
      unsafeProcesses.spawn.mockImplementation(() => Promise.reject());
      result = await npm.publish('simple-project', {
        cwd
      });
      expect(result).toEqual({ published: false });
    });

    test('Overrides the npm_config_registry env variable correctly', async () => {
      process.env = { npm_config_registry: 'https://registry.yarnpkg.com' };
      unsafeProcesses.spawn.mockImplementation(() => Promise.resolve());
      result = await npm.publish('simple-project', {
        cwd
      });

      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        'npm',
        ['publish'],
        containDeep({
          cwd,
          env: {}
        })
      );
    });
  });

  test('info()');
  test('addTag()');
  test('removeTag()');
});
