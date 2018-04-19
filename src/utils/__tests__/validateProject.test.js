// @flow

import path from 'path';
import validateProject from '../validateProject';
import * as yarn from '../yarn';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';
import * as Constants from '../../constants';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../yarn');
jest.mock('../logger');

const unsafeYarn: any & typeof yarn = yarn;

describe('utils/validateProject', () => {
  beforeEach(() => {
    unsafeYarn.add.mockImplementation(() => Promise.resolve());
  });

  test('should return true for a valid Project', async () => {
    let cwd = f.find('simple-project');
    let project = await Project.init(cwd);
    let valid = await validateProject(project);

    expect(valid).toBe(true);
  });

  test('should return false if project has a dependency on a workspace', async () => {
    let cwd = f.find('invalid-project-root-dependency-on-ws');
    let project = await Project.init(cwd);
    let valid = await validateProject(project);

    expect(valid).toBe(false);
  });

  describe('bolt.version field', () => {
    test('should return true if bolt version matches specified range', async () => {
      // expected version range is "0.14.x"
      let cwd = f.find('simple-project-with-bolt-version-check');
      let project = await Project.init(cwd);
      // $FlowFixMe
      Constants.BOLT_VERSION = '0.14.6';
      let valid = await validateProject(project);

      expect(valid).toBe(true);
    });

    test('should return false if bolt version doesnt match engines field', async () => {
      // expected version range is "0.14.x"
      let cwd = f.find('simple-project-with-bolt-version-check');
      let project = await Project.init(cwd);
      // $FlowFixMe
      Constants.BOLT_VERSION = '0.13.0';
      let valid = await validateProject(project);

      expect(valid).toBe(false);
    });

    test('should return false if a config is missing a version field', async () => {
      let cwd = f.find('project-with-missing-version-field');
      let project = await Project.init(cwd);

      let valid = await validateProject(project);

      expect(valid).toBe(false);
    });
  });
});
