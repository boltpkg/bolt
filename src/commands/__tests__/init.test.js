// @flow
import { init, toInitOptions } from '../init';
import * as yarn from '../../utils/yarn';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

jest.mock('../../utils/yarn');

describe('bolt init', () => {
  let projectDir;

  beforeEach(async () => {
    projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );
  });

  it('should be able to pass yes to yarn when y flag is passed', async () => {
    await init(toInitOptions([], { cwd: projectDir, y: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDir, 'init', [
      '-s',
      '-y'
    ]);
  });

  it('should be able to pass yes to yarn when yes flag is passes', async () => {
    await init(toInitOptions([], { cwd: projectDir, yes: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDir, 'init', [
      '-s',
      '-y'
    ]);
  });

  it('should be able to pass private to yarn when p flag is passed', async () => {
    await init(toInitOptions([], { cwd: projectDir, p: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDir, 'init', [
      '-s',
      '-p'
    ]);
  });

  it('should be able to pass private to yarn when private flag is passes', async () => {
    await init(toInitOptions([], { cwd: projectDir, private: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDir, 'init', [
      '-s',
      '-p'
    ]);
  });

  it('should be able to pass yes and private to yarn when private and yes flag is passes', async () => {
    await init(
      toInitOptions([], { cwd: projectDir, private: true, yes: true })
    );
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDir, 'init', [
      '-s',
      '-p',
      '-y'
    ]);
  });
});
