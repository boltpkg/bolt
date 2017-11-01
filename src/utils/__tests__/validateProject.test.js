// @flow

import { getFixturePath } from 'jest-fixtures';
import path from 'path';
import validateProject from '../validateProject';
import * as yarn from '../yarn';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';
import * as Constants from '../../constants';

jest.mock('../yarn');
jest.mock('../logger');

const unsafeYarn: any & typeof yarn = yarn;

describe('utils/validateProject', () => {
  beforeEach(() => {
    unsafeYarn.add.mockImplementation(() => Promise.resolve());
  });

  test('should return true for a valid Project', async () => {
    const cwd = await getFixturePath(__dirname, 'simple-project');
    const project = await Project.init(cwd);
    const valid = await validateProject(project);

    expect(valid).toBe(true);
  });

  test('should return false if project has a dependency on a workspace', async () => {
    const cwd = await getFixturePath(
      __dirname,
      'invalid-project-root-dependency-on-ws'
    );
    const project = await Project.init(cwd);
    const valid = await validateProject(project);

    expect(valid).toBe(false);
  });

  describe('engines.bolt field', () => {
    test('should return true if bolt version matches engines field', async () => {
      // expected version range is "0.14.x"
      const cwd = await getFixturePath(
        __dirname,
        'simple-project-with-engines-field'
      );
      const project = await Project.init(cwd);
      // $FlowFixMe
      Constants.BOLT_VERSION = '0.14.6';
      const valid = await validateProject(project);

      expect(valid).toBe(true);
    });

    test('should return false if bolt version doesnt match engines field', async () => {
      // expected version range is "0.14.x"
      const cwd = await getFixturePath(
        __dirname,
        'simple-project-with-engines-field'
      );
      const project = await Project.init(cwd);
      // $FlowFixMe
      Constants.BOLT_VERSION = '0.13.0';
      const valid = await validateProject(project);

      expect(valid).toBe(false);
    });
  });
});
