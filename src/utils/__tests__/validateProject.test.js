// @flow

import { getFixturePath } from 'jest-fixtures';
import path from 'path';
import validateProject from '../validateProject';
import * as yarn from '../yarn';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';

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
});
