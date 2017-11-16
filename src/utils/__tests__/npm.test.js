// @flow

import { getFixturePath } from 'jest-fixtures';

import * as npm from '../npm';
import Project from '../../Project';
import * as processes from '../processes';

jest.mock('../logger');
jest.mock('../processes');

const unsafeProcesses: any & typeof processes = processes;

describe('npm', () => {
  describe('publish', () => {
    let cwd;
    let result;

    beforeEach(async () => {
      cwd = await getFixturePath(__dirname, 'simple-project');
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
  });

  test('info()');
  test('addTag()');
  test('removeTag()');
});
